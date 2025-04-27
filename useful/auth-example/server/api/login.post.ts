import { z } from 'zod'
import prisma from '~/lib/prisma'

const bodySchema = z.object({
    username: z.string(),
    password: z.string()
})

export default defineEventHandler(async (event) => {
    const { username, password } = await readValidatedBody(event, bodySchema.parse)

    const user = await prisma.user.findFirst({
        where: {
            username: username,
        }
    })
    console.log(user)
    
    if (!user || !(await verifyPassword(user.password, password))) {
        throw createError({
            status: 401, 
            message: "Bad credentials"
        })
    }

    await setUserSession(event, {
        user:{
            username: username
        }
    })
    return {}
})