import puppeteer, { Browser } from "puppeteer"
import * as cheerio from "cheerio"

let browser: Browser | undefined

async function fetchHTML(url: string) {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: "/usr/bin/google-chrome",
        })
    }

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle0" }) // Use domcontentloaded for faster wait
    const html = await page.content()

    return html
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
                totalAdWord,
                totalLinks,
                totalResults,
                // html,
                html: html.length,
            }
        })

        const scrapedData = await Promise.all(promises)
        console.log(scrapedData)
    } catch (error) {
        console.error(error)
    } finally {
        if (browser) {
            await browser.close()
            browser = undefined
            return
        }
    }
}

await scrapeFirstPage(["scrape google", "react", "vue"])
