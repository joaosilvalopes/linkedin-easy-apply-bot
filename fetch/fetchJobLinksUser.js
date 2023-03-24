const wait = require("../utils/wait");
const selectors = require('../selectors');

const PAGE_SIZE = 7;

/**
 * Fetches job links as a user (logged in)
 */
async function* fetchJobLinksUser({ page, location, keywords, remote, easyApply, jobTitle }) {
  let numSeenJobs = 0;
  let numMatchingJobs = 0;

  const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${numSeenJobs}&count=${PAGE_SIZE}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

  await page.goto(url, { waitUntil: "load" });

  const numJobsHandle = await page.waitForSelector(selectors.searchResultListText, { timeout: 5000 });
  const numAvailableJobs = await numJobsHandle.evaluate((el) => parseInt(el.innerText.replace(',', '')));
  const jobTitleRegExp = new RegExp(jobTitle, 'i');

  while (numSeenJobs < numAvailableJobs) {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${numSeenJobs}&count=${PAGE_SIZE}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

    await page.goto(url, { waitUntil: "load" });

    await page.waitForSelector(`${selectors.searchResultListItem}:nth-child(${Math.min(PAGE_SIZE, numAvailableJobs - numSeenJobs)})`, { timeout: 5000 });

    const jobListings = await page.$$(selectors.searchResultListItem);

    for (const job of jobListings) {
      try {
        const linkHandle = await job.waitForSelector(selectors.searchResultListItemLink, { timeout: 10000 });
        const [link, title] = await linkHandle.evaluate((el) => [el.href.trim(), el.innerText.trim()]);

        if (jobTitleRegExp.test(title)) {
          numMatchingJobs++;
          console.log(numMatchingJobs + ' ' + keywords + ' remote jobs in ' + location + ' loaded, job title: ' + title);

          yield link;
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