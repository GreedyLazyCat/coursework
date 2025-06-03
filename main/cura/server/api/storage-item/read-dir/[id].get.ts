import { z } from 'zod'
import { paginateArray } from '~/server/utils/utils'

const querySchema = z.object({
    page: z.string().transform(numberValidator).catch(1),
    itemsPerPage: z.string().transform(numberValidator).catch(10)
})

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const storageItemId = getRouterParam(event, "id") ?? ""
    const query = await getValidatedQuery(event, querySchema.parse)
    const hasPermission = await hasPermissionForStorageItem(session.user.id, "storageItem.read", storageItemId)
    if (!hasPermission) {
        throw createError({
            statusCode: 401,
            message: ""
        })
    }

    const dirContents = await getStorageItemChildren(storageItemId)
    const paginated = paginateArray(dirContents, query.page, query.itemsPerPage)
    return paginated 
})