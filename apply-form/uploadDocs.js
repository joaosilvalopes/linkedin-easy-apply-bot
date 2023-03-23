const selectors = require('../selectors');

async function uploadDocs(page, cvPath, coverLetterPath) {
    const docDivs = await page.$$(selectors.documentUpload);

    for (const docDiv of docDivs) {
        const label = await docDiv.$(selectors.documentUploadLabel);
        const input = await docDiv.$(selectors.documentUploadInput);
        const text = await label.evaluate((el) => el.innerText.trim());

        if(text.includes("resume")) {
            await input.uploadFile(cvPath);
        } else if(text.includes("cover")) {
            await input.uploadFile(coverLetterPath);
        }
    }
}

module.exports = uploadDocs;
