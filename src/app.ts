import db from "./db/drizzle"
import { keyword, keywordSet, user } from "./db/schema"
import { addKeywordSet } from "./actions/addKeywordSet"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { desc, eq } from "drizzle-orm"
import getKeywordSet from "./actions/getKeywordSet"

export const app = express()
const port = 8000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port} ...`)
})

app.get("/api/getKeywordSets", async (req, res) => {
    try {
        const { userId } = req.query

        const result = await db
            .select({
                userName: user.name,
                userEmail: user.email,
                keywordSet: keywordSet.id,
                createdAt: keywordSet.createdAt,
                keyword: keyword.keyword,
            })
            .from(user)
            .rightJoin(keywordSet, eq(user.id, keywordSet.authorId))
            .leftJoin(keyword, eq(keywordSet.id, keyword.setId))
            .where(eq(user.id, parseInt(userId as string)))
            .orderBy(desc(keywordSet.createdAt))

        const transformedData = result.reduce((acc: any, curr) => {
            const index: number = acc.findIndex(
                (entry: any) => entry.keywordSet === curr.keywordSet
            )

            if (index !== -1) {
                acc[index].keywords.push(curr.keyword as string)
                acc[index].totalKeywords++
            } else {
                acc.push({
                    userName: curr.userName,
                    userEmail: curr.userEmail,
                    keywordSet: curr.keywordSet,
                    createdAt: curr.createdAt,
                    totalKeywords: 1,
                    keywords: [curr.keyword as string],
                })
            }

            return acc
        }, [])

        res.json(transformedData)
    } catch (error) {
        console.error(error)
    }
})

app.post("/api/addKeywordSet", async (req, res) => {
    const keywordSetData = await addKeywordSet(req.body)

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
