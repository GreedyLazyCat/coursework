import { z } from 'zod'

const bodySchema = z.object({
    "name": z.string()
})

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const body = await readValidatedBody(event, bodySchema.parse)
    const result = await findItemBySubstring(session.user.rootItemId, body.name)

    return result
})