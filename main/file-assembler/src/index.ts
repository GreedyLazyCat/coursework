import { Queue, Worker, Job } from 'bullmq';
import { config } from 'dotenv';
import { Redis } from 'ioredis';
config()

const connection = new Redis({
    port: 6379, // Redis port
    host: process.env.REDIS_HOST, // Redis host
    maxRetriesPerRequest: null
})

const worker = new Worker("files", async (job: Job) => {
    console.log(job.data)
}, {connection})