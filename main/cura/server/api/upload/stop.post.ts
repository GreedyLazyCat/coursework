
import { z } from 'zod'
import { Redis } from 'ioredis'
import { Queue, RedisConnection } from 'bullmq'

const bodySchema = z.object({
    storageItemId: z.string(),
})
const redisConnection = new Redis()
const assebmlyQueue = new Queue("assembly", { connection: redisConnection })

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const body = await readValidatedBody(event, bodySchema.parse)

    const hasPermission = await hasPermissionForStorageItem(session.user?.id as string, "storageItem.write", body.storageItemId)
    if (!hasPermission) {
        throw createError({
            statusCode: 401
        })
    }
    const db = useDrizzle()
    const storageItem = await storageItemById(db, body.storageItemId)
    if (!storageItem) {
        throw createError({
            statusCode: 401,
            message: "Такого файла не существует"
        })
    }
    await db.update(tables.storageItem)
        .set({ uploadStatus: "ASSEMBLING" })
        .where(eq(tables.storageItem.id, storageItem.id))
    /* Тут отправка задачи на сборки на worker */
    await assebmlyQueue.add("assebmle-file", {
        storageItemId: storageItem.id
    })
})