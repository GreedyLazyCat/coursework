import { z } from 'zod'
import * as fs from 'fs'
import { Redis } from 'ioredis'
import { Queue } from 'bullmq'
import { writeFileChunk } from '~/lib/fileUtils'
import { trace } from 'console'

function numberValidator(val: string, ctx: z.RefinementCtx) {
    try {
        const parsed = Number.parseInt(String(val));
        return parsed;
    } catch (e) {
        ctx.addIssue({
            code: "custom",
            message: "Not a number",
        });
        return z.NEVER;
    }

}

const bodySchema = z.object({
    storageItemId: z.string(),
    chunkNumber: z.string().transform(numberValidator),
    chunkSize: z.string().transform(numberValidator),
    hash: z.string(),
    chunk: z.any().refine((file) => file instanceof Blob, 'Файл обязателен')
})

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const formData = await readFormData(event)
    const db = useDrizzle()
    const toValidate = {
        storageItemId: formData.get("storageItemId"),
        chunkNumber: formData.get("chunkNumber"),
        chunkSize: formData.get("chunkSize"),
        hash: formData.get("hash"),
        chunk: formData.get("chunk"),
    }

    const validated = bodySchema.safeParse(toValidate)
    if (!validated.success) {
        throw createError({
            statusCode: 400,
            message: "Неверный формат данных"
        })
    }

    const storageItems = await db.select().from(tables.storageItem).where(eq(tables.storageItem.id, validated.data.storageItemId))
    if(storageItems.length === 0){
        /* Логировать */
        throw createError({
            statusCode: 400,
            message: "Неверный формат данных"
        })
    }

    try {
        await db.insert(tables.uploadChunk).values({
            storageItemId: validated.data.storageItemId,
            chunkNumber: validated.data.chunkNumber,
            chunkSize: validated.data.chunkSize,
            hash: validated.data.hash
        })
        await writeFileChunk(validated.data.storageItemId,
            validated.data.chunk,
            validated.data.hash,
            validated.data.chunkNumber)
    }
    catch (e) {
        console.log(e)
    }

})