import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

import checkDotEnvExists from '../utils/checkDotEnvExists';
import fetchJobLinksGuest from './fetchJobLinksGuest';

dotenv.config();

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: ["--disable-setuid-sandbox", "--no-sandbox"]
    });

    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    try {
        checkDotEnvExists();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    const links = await fetchJobLinksGuest({
        page,
        location: process.env.LOCATION || '',
        keywords: process.env.KEYWORDS || '',
        remote: process.env.REMOTE === "true",
        easyApply: process.env.EASY_APPLY === "true",
        jobTitle: process.env.JOB_TITLE || '',
    });

    console.log(links);

    await browser.close();
})();
