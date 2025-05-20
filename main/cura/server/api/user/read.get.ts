import { useRoute } from "vue-router"


export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const db = useDrizzle()
    const users = await db.select().from(tables.user).where(eq(tables.user.id, user.id))
    if (users.length > 0) {
        const userFromDB = users[0]
        return {
            username: userFromDB.username,
            email: userFromDB.email
        }
    }
    throw createError({
        statusCode: 403
    })
})