const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const wait = require("./utils/wait");
const login = require("./utils/login");
const apply = require("./utils/apply");
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

  await login({ page, email: process.env.LINKEDIN_EMAIL, password: process.env.LINKEDIN_PASSWORD });

  const links = await fetchJobLinksUser({
    page,
    location: process.env.LOCATION,
    keywords: process.env.KEYWORDS,
    remote: process.env.REMOTE === "true",
    easyApply: process.env.EASY_APPLY === "true"
  });

  console.log(links);

  for(const link of links) {
    const page = await context.newPage();
    await apply({ page, link, formData: { phone: process.env.PHONE, cvPath: process.env.CV_PATH } });
    await wait(2000);

  }

  // await browser.close();
})();
