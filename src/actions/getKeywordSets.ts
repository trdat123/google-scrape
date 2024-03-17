import { desc, eq } from "drizzle-orm"
import db from "../db/drizzle"
import { keyword, keywordSet, user } from "../db/schema"

const getKeywordSets = async (userEmail: string) => {
    try {
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
            .where(eq(user.email, userEmail as string))
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

        return transformedData
    } catch (error) {
        console.error(error)
    }
}

export default getKeywordSets
