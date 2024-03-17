import type { IKeyword } from "../types/IKeyword"

export function truncateString(str: string, maxLength: number) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + "... (truncated)"
    }
    return str
}

export function truncateStringFromScrapeData(scrapedData: IKeyword[]) {
    scrapedData.forEach((e) => {
        if (e.htmlString) {
            e.htmlString = decodeURIComponent(e.htmlString)
            e.htmlString = truncateString(e.htmlString, 40)
        }
    })

    return scrapedData
}
