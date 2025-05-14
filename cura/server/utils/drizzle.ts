import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '~/server/db/schema'

export const tables = schema

export function useDrizzle() {
  return drizzle(`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` , { schema })
}

