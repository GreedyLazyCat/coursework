import { z } from 'zod'
import { hasPermissionForStorageItem } from '~/server/utils/dbUtils'

const bodySchema = z.object({
    userId: z.string(),
    storageItemId: z.string(),
    permission: z.string()
})

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse)
    return await hasPermissionForStorageItem(body.userId, body.permission, body.storageItemId)
})