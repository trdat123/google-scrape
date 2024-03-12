import puppeteer, { Browser } from "puppeteer"
import * as cheerio from "cheerio"

let browser: Browser

async function fetchHTML(url: string) {
    if (!browser) {
        browser = await puppeteer.launch({ headless: true })
    }

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle0" }) // Use domcontentloaded for faster wait
    const html = await page.content()
    await browser.close()

    return html
}

const scrapeFirstPage = async (searchInput: string) => {
    try {
        const html = await fetchHTML(
            `https://www.google.com/search?q=${searchInput.split(" ").join("+")}`
        )
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

        console.log({
            totalAdWord,
            totalLinks,
            totalResults,
            html,
            // html: html.length,
        })
    } catch (error) {
        console.error("Error")
    }
}

await scrapeFirstPage("scrape google")
