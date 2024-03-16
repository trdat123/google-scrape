import db from "../db/drizzle"
import { keyword } from "../db/schema"
import { truncateString, truncateStringFromScrapeData } from "../utils/truncateString"

export const getKeywordSet = async () => {
    try {
        let result = await db.select().from(keyword)

        const truncatedData = truncateStringFromScrapeData(result)

        return truncatedData
    } catch (error) {
        console.error(error)
    }
}

getKeywordSet()
