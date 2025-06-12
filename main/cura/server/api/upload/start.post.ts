import { NodePgClient, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { z } from 'zod'
import { removeFile } from '~/lib/fileUtils';
import { isNull, max } from 'drizzle-orm';
const uploadType = z.enum(["REPLACE", "CONTINUE", "START"])
const bodySchema = z.object({
    parentId: z.any(),
    storageItemId: z.any(),
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
    uploadType: uploadType
})


export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const body = await readValidatedBody(event, bodySchema.parse)
    const hasPermission = await hasPermissionForStorageItem(session.user?.id as string, "storageItem.write", body.parentId ?? session.user?.rootItemId)
    if (!hasPermission) {
        throw createError({
            statusCode: 401,
            message: ""
        })
    }
    /* Сначала базовый функционал, потом обработка edge case'ов */
    const db = useDrizzle()

    /* Обработка случая, если файл с таким именем в этой папке уже существует
        - Нужно будет добавить что-то вроде истории для файлов
        пока файл просто затрет старый. 
        - Сейчас просто удалить файл в физ хранилище, начать загрузку заново
        поставить статус INITIALIZED в существующую запись
    */

    /*
        В Случае если сервер получил CONTINUE - то нужно вернуть каких диапозонов чанков не хватает
        */
    const validateStorageItem = async () => {
        if (body.storageItemId === undefined) {
            throw createError({
                statusCode: 403,
                message: "Неверный формат данных"
            })
        }
        const storageItem = await storageItemById(db, body.storageItemId)
        if (!storageItem) {
            throw createError({
                statusCode: 403,
                message: "Неверный формат данных"
            })
        }
        return storageItem
    }
    switch (body.uploadType) {
        case "START":
            const parentId = body.parentId ?? session.user?.rootItemId
            const storageItemChecked = await storageItemExistsInFolder(db, body.name, body.mimeType, parentId)
            if (storageItemChecked) {
                throw createError({
                    statusCode: 403,
                    message: "Файл с таким именем уже существует"
                })
            }
            /* Файла с таким именем в этой папке не существует */
            const inserts = await db.insert(tables.storageItem).values({
                name: body.name,
                mimeType: body.mimeType,
                size: body.size,
                type: "FILE",
                uploadStatus: "INITIALIZED",
                parentId: parentId
            }).returning({
                id: tables.storageItem.id
            })
            return {
                id: inserts[0].id
            }
        case "CONTINUE":
            /* Подсчет утерянных чанков
                В идеале: вернуть все диапазоны утерянных/не загруженных чанков
                Сейчас: номер последнего загруженного чанка
            */
            const storageItemContinue = await validateStorageItem()
            if (storageItemContinue.uploadStatus !== "LOADING") {
                throw createError({
                    statusCode: 403,
                    message: "Файл уже загружен или только проинициализирован"
                })
            }
            const maxNumber = await (await db.select({ value: max(tables.uploadChunk.chunkNumber) })
                .from(tables.uploadChunk)
                .where(eq(tables.uploadChunk.storageItemId, storageItemContinue.id)))

            return {
                id: storageItemContinue.id,
                lastChunkNumber: (maxNumber.length === 0) ? 0 : maxNumber[0].value
            }
        case "REPLACE":
            const storageItem = await validateStorageItem()
            await db.update(tables.storageItem).set({
                uploadStatus: "INITIALIZED"
            }).where(eq(tables.storageItem.id, storageItem.id))
            /*
            Здесь можно ввести состояние REPLACING и когда клиент завершит загрузку
            на другом маршруте удалить старый файл.
            При этом перед началом замены переименовать старый файл в id_old
            */
            //Подумать стоит ли удаление тоже в воркер перенести
            removeFile(storageItem.storagePath as string)
            break;
    }


})