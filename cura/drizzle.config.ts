import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'


export default defineConfig({
    schema: './server/db/schema.ts',
    out: './server/db',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
})