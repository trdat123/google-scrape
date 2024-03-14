import { truncateString } from "../utils/truncateString"
import db from "./drizzle"
import { keyword, keywordSet, user } from "./schema"

let result = await db.select().from(keyword)

result.forEach((e) => {
    if (e.htmlString) e.htmlString = truncateString(e.htmlString, 40)
})

console.log(result)

// await db.delete(keyword)
// await db.delete(keywordSet)

console.log("Finished")
