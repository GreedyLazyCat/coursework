import { z } from 'zod'
const storageItemType = z.enum(["FILE", "FOLDER"])
const bodySchema = z.object({
    parentId: z.string(),
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
    type: storageItemType
})

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



    /* Файла с таким именем в этой папки не существует */
    await db.insert(tables.storageItem).values({
        name: body.name,
        mimeType: body.mimeType,
        size: body.size,
        type: body.type,
        uploadStatus: "INITIALIZED"
    })

    
    /* Вернуть storageItemId */
    return {}
})