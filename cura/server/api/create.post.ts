import { prisma } from '~/lib/prisma'

export default defineEventHandler(async(event) =>{
  await prisma.user.create({
    data: {
      username: 'test',
      password: 'test',
      email: 'test@test.com'
    }
  })
  return {
    hello: 'world'
  }
})