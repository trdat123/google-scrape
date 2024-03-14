import db from "../db/drizzle"
import { keywordSet, user } from "../db/schema"
import { keyword } from "../db/schema"
import type { IKeyword } from "../types/IKeyword"
import { eq } from "drizzle-orm"

export const addKeywordSet = async (data: IKeyword[]) => {
    try {
        const userData = await db
            .select({ authorId: user.id })
            .from(user)
            .where(eq(user.name, "test"))

        const setData = await db
            .insert(keywordSet)
            .values({ authorId: userData[0].authorId })
            .returning({ setId: keywordSet.id })

        data.forEach((el) => (el.setId = setData[0].setId))

        await db.insert(keyword).values(data)
    } catch (error) {
        console.error(error)
    }
}
