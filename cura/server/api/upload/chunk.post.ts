import { z } from 'zod'

const bodySchema = z.object({
    storageItemId: z.string(),
    chunckNumber: z.number(),
    chunckSize: z.number(),
    hash: z.string(),
    blob: z.any()
})

export default defineEventHandler(async (event) => {
    const body = await readFormData(event)
    bodySchema.parse(Object.fromEntries(body))
    console.log() 
})