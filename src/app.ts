import { Hono } from "Hono"
import db from "./db/drizzle"
import { keyword } from "./db/schema"
import { jsxRenderer } from "hono/jsx-renderer"
import { render } from "hono/jsx/dom"
import { getKeywordSet } from "./actions/getKeywordSet"

export const app = new Hono()

const server = Bun.serve({
    port: 5000,
    fetch: app.fetch,
})

console.log(`Listening on http://localhost:${server.port} ...`)

app.get("/api/keywordSet", async (c) => {
    const name = await getKeywordSet()
    return c.json(name)
})
