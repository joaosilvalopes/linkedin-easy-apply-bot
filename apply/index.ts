import puppeteer, { Page } from "puppeteer";
import dotenv from "dotenv";

import checkDotEnvExists from "../utils/checkDotEnvExists";
import ask from "../utils/ask";
import login from "./login";
import apply, { ApplicationFormData } from "./apply";
import fetchJobLinksUser from "./fetchJobLinksUser";

dotenv.config();

interface AppState {
  paused: boolean;
}

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const state: AppState = {
  paused: false,
};

const askForPauseInput = async () => {
  await ask("press enter to pause the program");

  state.paused = true;

  await ask("press enter to continue the program");

  state.paused = false;
  console.log("unpaused");

  askForPauseInput();
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ["--disable-setuid-sandbox", "--no-sandbox",]
  });
  const context = await browser.createIncognitoBrowserContext();
  const listingPage = await context.newPage();

  const pages = await browser.pages();

  await pages[0].close();

  try {
    checkDotEnvExists();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  await login({ page: listingPage, email: process.env.LINKEDIN_EMAIL || "", password: process.env.LINKEDIN_PASSWORD || "" });

  askForPauseInput();

  const linkGenerator = fetchJobLinksUser({
    page: listingPage,
    location: process.env.LOCATION || "",
    keywords: process.env.KEYWORDS || "",
    remote: process.env.REMOTE === "true",
    easyApply: process.env.EASY_APPLY === "true",
    jobTitle: process.env.JOB_TITLE || "",
    jobDescription: process.env.JOB_DESCRIPTION || ""
  });

  let applicationPage: Page | null = null;

  for await (const [link, title, companyName] of linkGenerator) {
    if (!applicationPage || process.env.SINGLE_PAGE !== "true")
      applicationPage = await context.newPage();

    await applicationPage.bringToFront();

    try {
      const formData: ApplicationFormData = {
        phone: process.env.PHONE || "",
        cvPath: process.env.CV_PATH || "",
        homeCity: process.env.HOME_CITY || "",
        coverLetterPath: process.env.COVER_LETTER_PATH || "",
        yearsOfExperience: process.env.YEARS_OF_EXPERIENCE || "",
        languageProficiency: process.env.LANGUAGE_PROFICIENCY || "",
        requiresVisaSponsorship: process.env.REQUIRES_VISA_SPONSORSHIP === "true",
        booleans: process.env.BOOLEANS || "",
        textFields: process.env.TEXT_FIELDS || "",
        multipleChoiceFields: process.env.MULTIPLE_CHOICE_FIELDS || "",
      };

      await apply({
        page: applicationPage,
        link,
        formData,
        shouldSubmit: process.argv[2] === "SUBMIT",
      });

      console.log(`Applied to ${title} at ${companyName}`);
    } catch {
      console.log(`Error applying to ${title} at ${companyName}`);
    }

    await listingPage.bringToFront();

    while(state.paused) {
      console.log("program paused, press enter to continue the program");
      await wait(2000);
    }
  }

  // await browser.close();
})();
