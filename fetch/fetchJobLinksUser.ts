import { ElementHandle, Page } from 'puppeteer';
import LanguageDetect from 'languagedetect';

import buildUrl from '../utils/buildUrl';
import wait from '../utils/wait';
import selectors from '../selectors';

const MAX_PAGE_SIZE = 7;
const languageDetector = new LanguageDetect();

async function getJobSearchMetadata({ page, location, keywords }: { page: Page, location: string, keywords: string }) {
  await page.goto('https://linkedin.com/jobs/search', { waitUntil: "load" }); //goto to jobs page


  
  //deal with keyword box
  await page.waitForSelector(selectors.keywordInput, { visible: true }); //wait for keyword box to load
  await page.type(selectors.keywordInput, keywords);                      //fill keyword box


  //deal with location box
  await page.waitForSelector(selectors.locationInput, { visible: true });
  await page.click(selectors.locationInput, { clickCount: 3 }); // select all text
  await page.keyboard.press('Backspace');                       // delete it
  await page.type(selectors.locationInput, location);           //type location


  //get search results
  await page.$eval('button.jobs-search-box__submit-button', (el) => el.click());




  //get geoId
  await page.waitForFunction(() => new URLSearchParams(document.location.search).has('geoId'));
  const geoId = await page.evaluate(() => new URLSearchParams(document.location.search).get('geoId'));


  //get numAvailableJobs
  await page.waitForTimeout(3000) //wait for search results to load to get the correct num of jobs (not ideal lol)

  const numJobsHandle = await page.waitForSelector(selectors.searchResultListText, { timeout: 10000 }) as ElementHandle<HTMLElement>;
  
  const numAvailableJobs = await numJobsHandle.evaluate((el) => {
    const span = el.firstElementChild as HTMLElement; // first (and only) child
    return parseInt(span.innerText.replace(/,/g, ''), 10);
  });

  console.log("geoId: " + geoId)
  console.log("numAvailableJobs: " + numAvailableJobs)

  return {
    geoId,
    numAvailableJobs
  };
};

interface PARAMS {
  page: Page,
  location: string,
  keywords: string,
  workplace: { remote: boolean, onSite: boolean, hybrid: boolean },
  jobTitle: string,
  jobDescription: string,
  jobDescriptionLanguages: string[]
};

/**
 * Fetches job links as a user (logged in)
 */
async function* fetchJobLinksUser({ page, location, keywords, workplace: { remote, onSite, hybrid }, jobTitle, jobDescription, jobDescriptionLanguages }: PARAMS): AsyncGenerator<[string, string, string]> {
  let numSeenJobs = 0;
  let numMatchingJobs = 0;
  const fWt = [onSite, remote, hybrid].reduce((acc, c, i) => c ? [...acc, i + 1] : acc, [] as number[]).join(',');

  const { geoId, numAvailableJobs } = await getJobSearchMetadata({ page, location, keywords });

  // Build search parameters for jobs page
  const searchParams: { [key: string]: string } = {
    keywords,
    location,
    start: numSeenJobs.toString(),
    f_WT: fWt,
    f_AL: 'true'
  };

  if(geoId) {
    searchParams.geoId = geoId.toString();
  }

  // Construct the full search URL
  const url = buildUrl('https://www.linkedin.com/jobs/search', searchParams);

  // Prepare regex for job title and description filtering
  const jobTitleRegExp = new RegExp(jobTitle, 'i');
  const jobDescriptionRegExp = new RegExp(jobDescription, 'i');

  // Loop through all available jobs (pagination)
  while (numSeenJobs < numAvailableJobs) {
    url.searchParams.set('start', numSeenJobs.toString());

    await page.goto(url.toString(), { waitUntil: "load" });

    await page.waitForSelector(`${selectors.searchResultListItem}:nth-child(${Math.min(MAX_PAGE_SIZE, numAvailableJobs - numSeenJobs)})`, { timeout: 10000 });

    const jobListings = await page.$$(selectors.searchResultListItem);

    // Extract job link and title, click to open job details
    for (let i = 0; i < Math.min(jobListings.length, MAX_PAGE_SIZE); i++) {
      try {

        const [link, title] = await page.$eval(`${selectors.searchResultListItem}:nth-child(${i + 1}) ${selectors.searchResultListItemLink}`, (el) => {
          const linkEl = el as HTMLLinkElement;

          linkEl.click();

          return [linkEl.href.trim(), linkEl.innerText.trim()];
        });

        await page.waitForFunction(async (selectors) => {
          const hasLoadedDescription = !!document.querySelector<HTMLElement>(selectors.jobDescription)?.innerText.trim();
          const hasLoadedStatus = !!(document.querySelector(selectors.easyApplyButtonEnabled) || document.querySelector(selectors.appliedToJobFeedback));

          return hasLoadedStatus && hasLoadedDescription;
        }, {}, selectors);

        const companyName = await page.$eval(`${selectors.searchResultListItem}:nth-child(${i + 1}) ${selectors.searchResultListItemCompanyName}`, el => (el as HTMLElement).innerText).catch(() => 'Unknown');;
        

        
        const jobDescription = await page.$eval(selectors.jobDescription, el => (el as HTMLElement).innerText);
        const canApply = !!(await page.$(selectors.easyApplyButtonEnabled));
        const jobDescriptionLanguage = languageDetector.detect(jobDescription, 1)[0][0];
        const matchesLanguage = jobDescriptionLanguages.includes("any") || jobDescriptionLanguages.includes(jobDescriptionLanguage);


        if (canApply && jobTitleRegExp.test(title) && jobDescriptionRegExp.test(jobDescription) && matchesLanguage) {
          numMatchingJobs++;

          yield [link, title, companyName];
        }
      } catch (e) {
        console.log(e);
      }
    }

    await wait(2000);

    numSeenJobs += jobListings.length;
  }
}

export default fetchJobLinksUser;
