import { z } from 'zod'
import {Redis} from 'ioredis'
import { Queue } from 'bullmq'
import { writeFileChunk } from '~/lib/fileUtils'

const bodySchema = z.object({
    storageItemId: z.string(),
    chunckNumber: z.number(),
    chunckSize: z.number(),
    hash: z.string(),
    blob: z.any()
})
const redisConnection = new Redis({
    host: process.env.REDIS_HOST,
    maxRetriesPerRequest: null
})

export default defineEventHandler(async (event) => {
    const body = await readFormData(event)
    const bodyObject = Object.fromEntries(body)
    const fileId = 'asdfasdf'
    await writeFileChunk(fileId, (bodyObject.blob as File), 1) 
})