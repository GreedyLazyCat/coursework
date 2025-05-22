import { Queue, Worker, Job } from 'bullmq';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { Redis } from 'ioredis';
import { join, resolve } from 'path';
config()

const connection = new Redis({
    port: 6379, // Redis port
    host: process.env.REDIS_HOST, // Redis host
    maxRetriesPerRequest: null
})

const worker = new Worker("assembly", async (job: Job) => {
    console.log(job.data)
}, {connection})

worker.on("failed", (job, reason)=>{
    console.log(reason)
})