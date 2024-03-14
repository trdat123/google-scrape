import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString = process.env.POSTGRES_URL

if (!connectionString) throw Error("Database connection error")

const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql)

export default db
