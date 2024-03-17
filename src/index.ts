import puppeteer, { Browser } from "puppeteer"
import * as cheerio from "cheerio"
import type { IKeyword } from "./types/IKeyword"

let browser: Browser | undefined

const fetchHTML = async (url: string) => {
    try {
        const page = await browser!.newPage()
        await page.goto(url, { waitUntil: "networkidle0" })
        const html = await page.content()
        await page.close()

        return html
    } catch (error) {
        console.error(error)
        throw Error
    }
}

const scrapeFirstPage = async (searchInputs: string[]): Promise<IKeyword[]> => {
    try {
        if (!browser) {
            console.log("Browser opened!")

            browser = await puppeteer.launch({
                headless: true,
                // executablePath: "/usr/bin/google-chrome",
            })
        }
        const promises = searchInputs.map(async (input) => {
            const url = `https://www.google.com/search?q=${input.split(" ").join("+")}`
            const html = await fetchHTML(url)
            const $ = cheerio.load(html)
            let totalAdWords: number
            let totalLinks: number
            let resultStats: string

            const totalResultsTag = $("#result-stats")
            resultStats = $(totalResultsTag).text().trim()
            if (resultStats.length === 0) resultStats = "(No data in this page)"

            const adWordTags = $("#tvcap")
            totalAdWords = adWordTags.length

            const aTags = $("a")
            totalLinks = aTags.length

            return {
                keyword: input,
                totalAdWords,
                totalLinks,
                resultStats,
                htmlString: encodeURIComponent(html),
            }
        })

        const scrapedData = await Promise.all(promises)
        return scrapedData
    } catch (error) {
        console.error(error)
        if (browser) {
            await browser.close()
            browser = undefined
        }
        throw error
    } finally {
        if (browser) {
            await browser.close()
            browser = undefined
            console.log("Browser closed!")
        }
    }
}

export default scrapeFirstPage
