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

async function storageItemById(db: NodePgDatabase<typeof import("d:/Uni/kursasch/main/cura/server/db/schema")> & {
    $client: NodePgClient;
}, id: string): Promise<typeof tables.storageItem.$inferSelect | undefined> {
    try {
        const storageItems = await db.select().from(tables.storageItem).where(eq(tables.storageItem.id, id))
        if (storageItems.length !== 0) {
            return storageItems[0]
        }
        return undefined
    }
    catch (e) {
        console.log(e)
        return undefined
    }
}

async function storageItemExistsInFolder(
    db: NodePgDatabase<typeof import("d:/Uni/kursasch/main/cura/server/db/schema")> & { $client: NodePgClient; },
    name: string,
    mimeType: string,
    parentId: typeof tables.storageItem.parentId.dataType
): Promise<typeof tables.storageItem.$inferSelect | undefined> {

    try {
        const storageItems = await db.select()
            .from(tables.storageItem)
            .where(and(eq(tables.storageItem.name, name),
                eq(tables.storageItem.mimeType, mimeType),
                (parentId) ? eq(tables.storageItem.parentId, parentId) : isNull(tables.storageItem.parentId),
                eq(tables.storageItem.type, "FILE")
            ))
        console.log(parentId)
        if (storageItems.length !== 0) {
            return storageItems[0]
        }
        return undefined
    }
    catch (e) {
        console.log(e)
        return undefined
    }
}

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse)

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
            const storageItemChecked = await storageItemExistsInFolder(db, body.name, body.mimeType, body.parentId)
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
                parentId: body.parentId
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