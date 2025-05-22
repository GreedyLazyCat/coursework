import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
config()

export default defineConfig({
    out: './src/db',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    },
});