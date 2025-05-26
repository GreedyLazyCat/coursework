import { z } from 'zod'
import { getUserOwnedItem } from '../utils/dbUtils'

const bodySchema = z.object({
    username: z.string(),
    password: z.string(),
})
//TODO: логгирование, дельная вещь, вдруг что сломается
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
    const rootItemId = await getUserOwnedItem(user.id, "owner")
    if (await verifyPassword(user.password, password)) {
        console.log('Verified password')
        await setUserSession(event, {
            user: {
                id: user.id,
                rootItemId: rootItemId
            }
        })
        return { message: 'Logged in' }
    }
    throw createError({ statusCode: 400, statusMessage: 'Bad Credentials', message: JSON.stringify(errorObj) })
})
