async function readCSV(filePath: string) {
    const csvData = Bun.file(filePath) // Read CSV file as UTF-8 string
    return (await csvData.text()).split("\n")
}

export default readCSV
