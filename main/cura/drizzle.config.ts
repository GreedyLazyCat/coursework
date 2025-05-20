import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'


export default defineConfig({
    schema: './server/db/schema.ts',
    out: './server/db',
    dialect: 'postgresql',
    dbCredentials: {
        url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` 
    }
})