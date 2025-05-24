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

const fileAssembler = new Worker("assembly", async (job: Job) => {
    /* -- Отсортировать пришедшие чанки по номеру -- */
    let dbChunks = await db.select()
        .from(schema.uploadChunk)
        .where(eq(schema.uploadChunk.storageItemId, job.data.storageItemId as string))

    if (dbChunks.length === 0) {
        throw new Error("No chunks available")
    }
    dbChunks = dbChunks.sort((a, b) => a.chunkNumber - b.chunkNumber)

    assebmleFile(job.data.storageItemId, dbChunks)

    await db.update(schema.storageItem).set({
        uploadStatus: "FINISHED"
    }).where(eq(schema.storageItem.id, job.data.storageItemId))

    await db.delete(schema.uploadChunk)
        .where(eq(schema.uploadChunk.storageItemId, job.data.storageItemId))

}, { connection })

fileAssembler.on("error", (reason) => {
    console.log(`Worker failed.\nReason: ${reason}`)
})

fileAssembler.on("failed", (job, reason) => {
    console.log(`Worker failed on job ${job}\nReason: ${reason}`)
})