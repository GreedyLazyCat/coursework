export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const storageItemId = getRouterParam(event, "id") ?? ""
    const hasPermission = await hasPermissionForStorageItem(session.user.id, "storageItem.read", storageItemId)
    if (!hasPermission) {
        throw createError({
            statusCode: 403,
            message: "Unauthorized"
        })
    }

    return await getStorageItemParentsPath(storageItemId)

})