import { z } from 'zod'

const bodySchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email()
})

export default defineEventHandler(async (event) => {
    const { username, password, email } = await readValidatedBody(event, bodySchema.parse)
    const db = useDrizzle()
    const userExists = await db.select().from(tables.user).where(eq(tables.user.username, username))
    if (userExists.length > 0) {
        const errorObj = {
            username: 'Пользователь с таким username уже существует'
        }
        throw createError({
            statusCode: 400, statusMessage: 'Пользователь с таким username уже существует', message: JSON.stringify(errorObj)
        })
    }
    const emailExists = await db.select().from(tables.user).where(eq(tables.user.email, email))
    if (emailExists.length > 0) {
        const errorObj = {
            email: 'Пользователь с таким email уже существует'
        }
        throw createError({
            statusCode: 400, statusMessage: 'Пользователь с таким email уже существует', message: JSON.stringify(errorObj)
        })
    }
    const hashedPassword = await hashPassword(password)
    await db.insert(tables.user).values({ username, password: hashedPassword, email })
    setResponseStatus(event, 201)
    return { message: 'User created' }
})