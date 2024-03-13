import puppeteer, { Browser } from "puppeteer"
import * as cheerio from "cheerio"
import readCSV from "./utils/readCSV"

let browser: Browser | undefined
if (!browser) {
    console.log("browser!")

    browser = await puppeteer.launch({
        headless: true,
        // executablePath: "/usr/bin/google-chrome",
    })
}

async function fetchHTML(url: string) {
    try {
        const page = await browser!.newPage()
        await page.goto(url, { waitUntil: "domcontentloaded" }) // Use domcontentloaded for faster wait
        const html = await page.content()
        await page.close()

        return html
    } catch (error) {
        console.error(error)
        throw Error
    }
}

const scrapeFirstPage = async (searchInputs: string[]) => {
    try {
        const promises = searchInputs.map(async (input) => {
            const url = `https://www.google.com/search?q=${input.split(" ").join("+")}`
            const html = await fetchHTML(url)
            const $ = cheerio.load(html)
            let totalLinks: number
            let totalAdWord: number
            let totalResults: string

            const totalResultsTag = $("#result-stats")
            totalResults = $(totalResultsTag).text().trim()

            const adWordTags = $("#tvcap")
            totalAdWord = adWordTags.length

            const aTags = $("a")
            totalLinks = aTags.length

            return {
                url,
                totalAdWord,
                totalLinks,
                totalResults,
                // html,
                htmlLength: html.length,
            }
        })

        const scrapedData = await Promise.all(promises)
        return scrapedData
    } catch (error) {
        console.error(error)
        throw error
    } finally {
        if (browser) {
            await browser.close()
            browser = undefined
        }
    }
}

const csvData = await readCSV("my_data.csv")
const data = await scrapeFirstPage(csvData)
console.log("🚀 ~ data:", data ? data : "Scrapping failed")
