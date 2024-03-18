import scrapeFirstPage from ".."
import db from "../db/drizzle"
import { keywordSet, user } from "../db/schema"
import { keyword } from "../db/schema"
import type { IKeyword } from "../types/IKeyword"
import { eq } from "drizzle-orm"
import { truncateStringFromScrapeData } from "../utils/truncateString"

export const addKeywordSet = async (
    keywordArr: string[],
    userInfo: { userName: string; userEmail: string }
) => {
    try {
        const { userName, userEmail } = userInfo

        let userData = await db
            .select({ authorId: user.id })
            .from(user)
            .where(eq(user.email, userEmail))

        if (userData.length == 0) {
            userData = await db
                .insert(user)
                .values({ email: userEmail, name: userName })
                .returning({ authorId: user.id })
        }

        const setData = await db
            .insert(keywordSet)
            .values({ authorId: userData[0].authorId })
            .returning()

        const setDataId = setData[0].id

        const scrapedData = await scrapeFirstPage(keywordArr)

        scrapedData.forEach((el) => (el.setId = setDataId))

        const keywordsData = await db.insert(keyword).values(scrapedData).returning()

        const truncatedData = truncateStringFromScrapeData(keywordsData)

        return truncatedData
    } catch (error) {
        console.error(error)
    }
}
