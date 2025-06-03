export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const storageItemId = getRouterParam(event, "id") ?? ""
    const hasPermission = await hasPermissionForStorageItem(session.user.id, "storageItem.read", storageItemId)
    if (!hasPermission) {
        throw createError({
            statusCode: 403
        })
    }
    const db = useDrizzle()
    const result = await db.select().from(tables.storageItem)
        .where(eq(tables.storageItem.id, storageItemId))
    if (result.length === 0) {
        throw createError({
            statusCode: 401,
            message: "Нет такого файла"
        })
    }
    return result[0]
})