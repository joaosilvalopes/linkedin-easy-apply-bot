import { Page } from 'puppeteer';

import wait from '../utils/wait';
import selectors from '../selectors';

/**
 * Fetches job links as a guest user (not logged in)
 */
async function fetchJobLinksGuest({ page, location, keywords, remote, easyApply, jobTitle }: {
  page: Page;
  location: string;
  keywords: string;
  remote: boolean;
  easyApply: boolean;
  jobTitle: string;
}): Promise<{ link: string, location: string, company: string, title: string }[]> {
  const jobLinks: { link: string, location: string, company: string, title: string }[] = [];
  const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${jobLinks.length}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;
  
  await page.goto(url, { waitUntil: "load" });
  
  // Scroll down to the bottom of the page to load more job listings
  const numJobs = await page.$eval(selectors.jobCount, el => parseInt((el as HTMLElement).innerText.replace(',', '')));
  let numJobsDisplayed = await page.$$(selectors.searchResultListItemGuest).then(el => el.length);
  while (numJobsDisplayed < numJobs) {
    try {
      await page.click(selectors.showMoreButton);
      await page.waitForSelector(selectors.showMoreButton, { timeout: 3000 });
      numJobsDisplayed = await page.$$(selectors.searchResultListItemGuest).then(el => el.length);
    } catch (err) {
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      numJobsDisplayed = await page.$$(selectors.searchResultListItemGuest).then(el => el.length);
    }
    console.log(numJobsDisplayed + '/' + numJobs + ' ' + keywords + ' remote jobs in ' + location + ' loaded');
    await wait(2000);
  }
  
  // Extract job information from the loaded job listings
  const jobListings = await page.$$(selectors.searchResultListItemGuest);
  const jobTitleRegExp = new RegExp(jobTitle, 'i');
  
  for(const job of jobListings) {
    const title = await job.$eval(selectors.searchResultListItemTitleGuest, (el) => (el as HTMLElement).innerText.trim());
    const company = await job.$eval(selectors.searchResultListItemSubtitleGuest, (el) => (el as HTMLElement).innerText.trim());
    const location = await job.$eval(selectors.searchResultListItemLocationGuest, (el) => (el as HTMLElement).innerText.trim());
    const link = await job.$eval("a", (el) => el.href);
  
    if (jobTitleRegExp.test(title)) {
      jobLinks.push({link, location, company, title });
    }
  };
  
  return jobLinks;
}

export default fetchJobLinksGuest;
