import db from "./db/drizzle"
import { keyword } from "./db/schema"
import { addKeywordSet } from "./actions/addKeywordSet"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { eq } from "drizzle-orm"
import getKeywordSet from "./actions/getKeywordSet"
import getKeywordSets from "./actions/getKeywordSets"

export const app = express()
const port = 8000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port} ...`)
})

app.get("/api/getKeywordSets", async (req, res) => {
    const { userEmail } = req.query

    const keywordSetsData = await getKeywordSets(userEmail as string)

    res.json(keywordSetsData)
})

app.post("/api/addKeywordSet", async (req, res) => {
    const keywordSetData = await addKeywordSet(
        req.body,
        req.query as { userName: string; userEmail: string }
    )

    if (!keywordSetData) res.status(400)

    res.json(keywordSetData)
})

app.get("/api/getHtmlString", async (req, res) => {
    if (!req.query) res.status(400)
    const { keywordId } = req.query

    const htmlString = await db
        .select({ htmlString: keyword.htmlString })
        .from(keyword)
        .where(eq(keyword.id, parseInt(keywordId as string)))

    res.status(200)
    res.send(htmlString[0].htmlString)
})

app.get("/api/getKeywordSingleSet", async (req, res) => {
    if (!req.query) res.status(400)
    const { setId } = req.query

    const result = await getKeywordSet(setId as unknown as number)

    res.status(200)
    res.json(result)
})
