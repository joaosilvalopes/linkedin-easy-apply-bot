const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const wait = require("./utils/wait");
const login = require("./utils/login");
const fetchJobLinksUser = require("./utils/fetchJobLinksUser");
const fetchJobLinksGuest = require("./utils/fetchJobLinksGuest");

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    executablePath: '/snap/bin/chromium',
    args: ["--disable-setuid-sandbox", "--no-sandbox",]
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  // await login({ page, email: process.env.LINKEDIN_EMAIL, password: process.env.LINKEDIN_PASSWORD });

  await login({ page, email: process.env.LINKEDIN_EMAIL, password: process.env.LINKEDIN_PASSWORD });

  const links = await fetchJobLinksUser({
    page,
    location: 'Portugal',
    keywords: 'javascript'
  });

  console.log(links);
/*
  for(const link of links) {
    await page.goto(link, { waitUntil: 'load' });
    await wait(2000);

  }*/

  // await browser.close();
})();
