const wait = require("../utils/wait");
const selectors = require('../selectors');

const PAGE_SIZE = 7;

/**
 * Fetches job links as a user (logged in)
 */
async function* fetchJobLinksUser({ page, location, keywords, remote, easyApply, jobTitle, jobDescription }) {
  let numSeenJobs = 0;
  let numMatchingJobs = 0;

  const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${numSeenJobs}&count=${PAGE_SIZE}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

  await page.goto(url, { waitUntil: "load" });

  const numJobsHandle = await page.waitForSelector(selectors.searchResultListText, { timeout: 5000 });
  const numAvailableJobs = await numJobsHandle.evaluate((el) => parseInt(el.innerText.replace(',', '')));
  const jobTitleRegExp = new RegExp(jobTitle, 'i');
  const jobDescriptionRegExp = new RegExp(jobDescription, 'i');

  while (numSeenJobs < numAvailableJobs) {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${numSeenJobs}&count=${PAGE_SIZE}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

    numSeenJobs > 0 && await page.goto(url, { waitUntil: "load" });

    await page.waitForSelector(`${selectors.searchResultListItem}:nth-child(${Math.min(PAGE_SIZE, numAvailableJobs - numSeenJobs)})`, { timeout: 5000 });

    const jobListings = await page.$$(selectors.searchResultListItem);

    for (let i = 0; i < jobListings.length; i++) {
      try {
        const linkHandle = await page.$(`${selectors.searchResultListItem}:nth-child(${i + 1}) ${selectors.searchResultListItemLink}`);

        const [link, title] = await linkHandle.evaluate((el) => [el.href.trim(), el.innerText.trim()]);

        await linkHandle.click();

        await page.waitForFunction(async (selectors) => {
          const hasLoadedDescription = !!document.querySelector(selectors.jobDescription).innerText.trim();
          const hasLoadedStatus = !!(document.querySelector(selectors.easyApplyButtonEnabled) || document.querySelector(selectors.appliedToJobFeedback));

          return hasLoadedStatus && hasLoadedDescription;
        }, {}, selectors);

        const companyName = await page.$eval(`${selectors.searchResultListItem}:nth-child(${i + 1}) ${selectors.searchResultListItemCompanyName}`, el => el.innerText).catch(() => 'Unknown');
        const jobDescription = await page.$eval(selectors.jobDescription, el => el.innerText);
        const canApply = !!(await page.$(selectors.easyApplyButtonEnabled));

        if (canApply && jobTitleRegExp.test(title) && jobDescriptionRegExp.test(jobDescription)) {
          numMatchingJobs++;

          yield [link, title, companyName];
        }
      } catch(e) {
        console.log(e);
      }
    }

    await wait(2000);

    numSeenJobs += jobListings.length;
  }
}

module.exports = fetchJobLinksUser;