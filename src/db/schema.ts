import { text, timestamp, pgTable, integer, varchar, serial } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
    id: serial("user_id").primaryKey().notNull(),
    name: text("name"),
    email: text("email").unique(),
    role: text("role").$type<"admin" | "customer">(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const keywordSet = pgTable("keywordSet", {
    id: serial("keyword_set_id").primaryKey().notNull(),
    authorId: integer("author_id").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const keyword = pgTable("keyword", {
    id: serial("keyword_id").primaryKey().notNull(),
    setId: integer("set_id").references(() => keywordSet.id),
    keyword: varchar("keyword").notNull(),
    totalAdWords: integer("total_ad_words").notNull(),
    totalLinks: integer("total_links").notNull(),
    resultStats: varchar("results_stats").notNull(),
    htmlString: text("html_string").notNull(),
})
