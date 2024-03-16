import { truncateString, truncateStringFromScrapeData } from "../utils/truncateString"
import db from "./drizzle"
import { keyword, keywordSet, user } from "./schema"

let result = await db.select().from(keyword)

const truncatedData = truncateStringFromScrapeData(result)

console.log(truncatedData)

// await db.delete(keyword)
// await db.delete(keywordSet)

console.log("Finished")
