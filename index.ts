import puppeteer, { Browser } from "puppeteer"
import * as cheerio from "cheerio"

let browser: Browser

async function fetchHTML(url) {
    if (!browser) {
        browser = await puppeteer.launch({ headless: true })
    }
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle0" }) // Use domcontentloaded for faster wait

    const html = await page.content()
    browser.close()
    return html
}

const scrapeFirstPage = async () => {
    try {
        const html = await fetchHTML(
            "https://www.google.com/search?q=scrapegoogle"
        )
        const $ = cheerio.load(html)
        const h3s: string[] = []
        let totalLinks: number
        let totalAdWord: number
        let totalResults: string

        const totalResultsTag = $("#result-stats")
        totalResults = $(totalResultsTag).text()

        const adWordTags = $("#tvcap")
        totalAdWord = adWordTags.length

        const aTags = $("a")
        totalLinks = aTags.length

        const h3Tags = $("h3")
        h3Tags.each((i, h3Tag) => {
            const text = $(h3Tag).text().trim()
            h3s.push(text)
        })

        console.log({
            totalAdWord,
            totalLinks,
            totalResults,
            html,
        })
    } catch (error) {
        console.error("Error")
    }
}

await scrapeFirstPage()
