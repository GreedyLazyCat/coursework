import { z } from 'zod'

const bodySchema = z.object({
    name: z.string(),
    parentId: z.string()
})

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const body = await readValidatedBody(event, bodySchema.parse)
    const hasPermission = await hasPermissionForStorageItem(session.user.id, "storageItem.write", body.parentId)
    if (!hasPermission) {
        throw createError({
            statusCode: 403,
            message: "Unauthorized"
        })
    }
    const db = useDrizzle()
    const created = await db.insert(tables.storageItem).values({
        name: body.name,
        parentId: body.parentId,
        mimeType: "",
        type: "FOLDER",
        uploadStatus: "FINISHED"
    }).returning()

    return created[0]
})