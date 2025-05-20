import { z } from 'zod'
import {Redis} from 'ioredis'
import WriteFileService from '~/lib/writeFileService'
import { Queue } from 'bullmq'

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
    const fileService = new WriteFileService()
    const fileId = 'asdfasdfasdf'
    const queue = new Queue("files")
    queue.add('test', {lol: "test", file: await (bodyObject.blob as File).arrayBuffer()})
    // fileService.startFileWriting(fileId) 
    // fileService.writeFilePart(fileId, bodyObject.blob as File)
})