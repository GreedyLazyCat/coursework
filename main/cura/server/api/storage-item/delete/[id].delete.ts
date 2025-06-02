import { deleteStorageItem } from "~/server/utils/dbUtils"

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const storageItemId = await getRouterParam(event, 'id')
    if (!storageItemId) {
        throw createError({
            statusCode: 401,
            message: "Bad request"
        })
    }
    const hasPermission = await hasPermissionForStorageItem(session.user.id, "storageItem.write", storageItemId)
    if (!hasPermission) {
        throw createError({
            statusCode: 403,
        })
    }
    await deleteStorageItem(storageItemId)
})