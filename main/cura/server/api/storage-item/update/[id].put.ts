import { z } from 'zod'

const bodySchema = z.object({
    name: z.any(),
    mimeType: z.any(),
    parentId: z.any(),
})

interface LooseObject {
    [key: string]: any
}

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const storageItemId = getRouterParam(event, "id") ?? ""
    const hasPermission = await hasPermissionForStorageItem(session.user.id, "storageItem.read", storageItemId)
    if (!hasPermission) {
        throw createError({
            statusCode: 401,
            message: ""
        })
    }
    const db = useDrizzle()
    const body = await readValidatedBody(event, bodySchema.parse)
    const toUpdate: LooseObject = {}
    if (body.name) {
        toUpdate.name = body.name.toString()
    }
    if (body.parentId) {
        toUpdate.parentId = body.parentId.toString()
    }
    if (body.mimeType) {
        toUpdate.mimeType = body.mimeType.toString()
    }
    const updated = await db.update(tables.storageItem)
        .set({
            updatedAt: sql`NOW()`,
            ...toUpdate
        })
        .where(eq(tables.storageItem.id, storageItemId))
})