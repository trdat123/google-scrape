import db from "../db/drizzle"
import { keyword } from "../db/schema"
import { truncateString } from "../utils/truncateString"

export const getKeywordSet = async () => {
    let result = await db.select().from(keyword)

    result.forEach((e) => {
        if (e.htmlString) e.htmlString = truncateString(e.htmlString, 40)
    })

    return result
}
