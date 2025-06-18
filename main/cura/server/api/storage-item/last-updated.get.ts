export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const result = await getRecentlyEdidetItems(session.user.rootItemId)
    return result
})