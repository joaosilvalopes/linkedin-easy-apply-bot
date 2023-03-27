import { ElementHandle, Page } from 'puppeteer';

import selectors from '../selectors';

async function uploadDocs(page: Page, cvPath: string, coverLetterPath: string): Promise<void> {
  const docDivs = await page.$$(selectors.documentUpload);

  for (const docDiv of docDivs) {
    const label = await docDiv.$(selectors.documentUploadLabel) as ElementHandle<HTMLElement>;
    const input = await docDiv.$(selectors.documentUploadInput) as ElementHandle<HTMLInputElement>;

    const text = await label.evaluate((el) => el.innerText.trim());

    if (text.includes("resume")) {
      await input.uploadFile(cvPath);
    } else if (text.includes("cover")) {
      await input.uploadFile(coverLetterPath);
    }
  }
}

export default uploadDocs;
