const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const wait = require("./utils/wait");
const fetchJobLinksGuest = require("./utils/fetchJobLinksGuest");

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    executablePath: process.env.CHROME_PATH,
    args: ["--disable-setuid-sandbox", "--no-sandbox",]
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  const links = await fetchJobLinksGuest({
    page,
    location: process.env.LOCATION,
    keywords: process.env.KEYWORDS,
    remote: process.env.REMOTE === "true",
    easyApply: process.env.EASY_APPLY === "true"
  });

  console.log(links);

  await browser.close();
})();
