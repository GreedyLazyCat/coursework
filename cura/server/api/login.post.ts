import { useLogger } from 'nuxt/kit'
import { z } from 'zod'

const bodySchema = z.object({
    username: z.string(),
    password: z.string(),
})

export default defineEventHandler(async (event) => {
    const { username, password } = await readValidatedBody(event, bodySchema.parse)
    console.log(`Logging in user ${username} password ${password}...`)
    console.log(`DB_USER: ${process.env.DB_USER} DB_PASSWORD: ${process.env.DB_PASSWORD} DB_NAME: ${process.env.DB_NAME} DB_HOST: ${process.env.DB_HOST} DB_PORT: ${process.env.DB_PORT}`)
    const db = useDrizzle()
    console.log('Connected to database')
    const fetchedUser = await db.select().from(tables.user).where(eq(tables.user.username, username))
    console.log(`Fetched user: ${JSON.stringify(fetchedUser)}`)
    const errorObj = {
        username: 'Неправильное имя пользователя или пароль.'
    }
    if (fetchedUser.length === 0) {

        throw createError({ statusCode: 400, statusMessage: 'Bad Credentials', message: JSON.stringify(errorObj) })
    }
    console.log('Checked that user exists')
    const user = fetchedUser[0]
    if (await verifyPassword(user.password, password)) {
        console.log('Verified password')
        await setUserSession(event, {
            user: {
                id: user.id
            }
        })
        console.log('set user session')
        return { message: 'Logged in' }
    }
    throw createError({ statusCode: 400, statusMessage: 'Bad Credentials', message: JSON.stringify(errorObj) })
})
