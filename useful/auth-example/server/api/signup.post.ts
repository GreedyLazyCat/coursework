
import { z } from 'zod'
import prisma from '~/lib/prisma'

const bodySchema = z.object({
    username: z.string(),
    password: z.string()
})

export default defineEventHandler(async (event) => {
    const { username, password } = await readValidatedBody(event, bodySchema.parse)
    const hashedPassword = await hashPassword(password)
    console.log(`username: ${username}`)
    console.log(`password: ${hashedPassword}`)
    console.log(`password: ${password}`)
    await prisma.user.create({
        data:{
            username: username,
            password: hashedPassword
        }
    })

    return {}
})