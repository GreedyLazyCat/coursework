import { z } from 'zod'

const bodySchema = z.object({
    username: z.string(),
    password: z.string(),
})

export default defineEventHandler(async (event) => {
    const { username, password } = await readValidatedBody(event, bodySchema.parse)
    const db = useDrizzle()
    const fetchedUser = await db.select().from(tables.user).where(eq(tables.user.username, username))
    const errorObj = {
        username: 'Неправильное имя пользователя или пароль.'
    }
    if (fetchedUser.length === 0) {

        throw createError({ statusCode: 400, statusMessage: 'Bad Credentials', message: JSON.stringify(errorObj) })
    }
    const user = fetchedUser[0]
    if (await verifyPassword(user.password, password)) {
        await setUserSession(event, {
            user: {
                id: user.id
            }
        })
        return { message: 'Logged in' }
    }
    throw createError({ statusCode: 400, statusMessage: 'Bad Credentials', message: JSON.stringify(errorObj) })
})
