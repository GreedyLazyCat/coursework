import { z } from 'zod'
const storageItemType = z.enum(["FILE", "FOLDER"])
const bodySchema = z.object({
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
    hash: z.string(),
    type: storageItemType
})

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse)

    /* Сначала базовый функционал, потом обработка edge case'ов */
    const db = useDrizzle()
    await db.insert(tables.storageItem).values({
        name: body.name,
        mimeType: body.mimeType,
        size: body.size,
        hash: body.hash,
        type: body.type,
        uploadStatus: "INITIALIZED"
    })

    return {}
})