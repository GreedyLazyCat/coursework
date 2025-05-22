import { Queue, Worker, Job } from 'bullmq';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Redis } from 'ioredis';
import * as schema from './db/schema.js'
import { eq } from 'drizzle-orm';
import { assebmleFile } from './utils.js';
config()

const connection = new Redis({
    port: 6379, // Redis port
    host: process.env.REDIS_HOST, // Redis host
    maxRetriesPerRequest: null
})

const connectionstring = `postgresql://${process.env.db_user}:${process.env.db_password}@${process.env.db_host}:${process.env.db_port}/${process.env.db_name}`
console.log(`connecting to database at ${connectionstring}`)
const db = drizzle(connectionstring, { schema })

const worker = new Worker("assembly", async (job: Job) => {
    /* -- Отсортировать пришедшие чанки по номеру -- */
    const dbChunks = await db.select()
        .from(schema.uploadChunk)
        .where(eq(schema.uploadChunk.storageItemId, job.data.storageItemId as string))

    assebmleFile(job.data.storageItemId, dbChunks)

    await db.update(schema.storageItem).set({
        uploadStatus: "FINISHED"
    }).where(eq(schema.storageItem.id, job.data.storageItemId))

    /* -- Удалить чанки из бд -- */
}, { connection })

worker.on("failed", (job, reason) => {
    console.log(reason)
})