import { expect, test } from "bun:test"
import scrapeFirstPage from "../src"
import { truncateString, truncateStringFromScrapeData } from "../src/utils/truncateString"
import readCSV from "./readCSV"

test("scrapeFunction", async () => {
    const csvData = await readCSV("./test/my_data_sm.csv")

    const scrapedData = await scrapeFirstPage(csvData)
    const truncatedData = truncateStringFromScrapeData(scrapedData)

    console.log("🚀 ~ scrapedData:", truncatedData)
    expect(truncatedData.length).toEqual(csvData.length)
}, 20000)
