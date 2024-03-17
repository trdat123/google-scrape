import { eq } from "drizzle-orm"
import db from "../db/drizzle"
import { keyword } from "../db/schema"
import { truncateStringFromScrapeData } from "../utils/truncateString"

const getKeywordSet = async (setId: number) => {
    try {
        let result = await db.select().from(keyword).where(eq(keyword.setId, setId))

        const truncatedData = truncateStringFromScrapeData(result)

        return truncatedData
    } catch (error) {
        console.error(error)
    }
}

export default getKeywordSet
