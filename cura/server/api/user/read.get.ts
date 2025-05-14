import { useRoute } from "vue-router"

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event)
    const db = useDrizzle()
    const users = await db.select().from(tables.user)
    return { message: users}
})