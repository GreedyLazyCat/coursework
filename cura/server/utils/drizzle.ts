import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '~/server/db/schema'

export const tables = schema

export function useDrizzle() {
  return drizzle(process.env.DATABASE_URL!, { schema })
}

