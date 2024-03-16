import db from "./db/drizzle"
import { keyword } from "./db/schema"
import { addKeywordSet } from "./actions/addKeywordSet"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { truncateStringFromScrapeData } from "./utils/truncateString"

export const app = express()
const port = 8000
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const middle = app.use(express.urlencoded({ extended: true, limit: 10000, parameterLimit: 2 }))

app.listen(port)
console.log(`Listening on http://localhost:${port} ...`)

app.get("/api/getKeywordSet", async (req, res) => {
    let result = await db.select().from(keyword)

    const truncatedData = truncateStringFromScrapeData(result)

    res.json(truncatedData)
})

app.post("/api/addKeywordSet", async (req, res) => {
    const keywordSetData = await addKeywordSet(req.body)

    if (!keywordSetData) res.status(400)

    res.json(keywordSetData)
})
