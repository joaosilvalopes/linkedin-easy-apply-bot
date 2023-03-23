const wait = require("../utils/wait");
const selectors = require('../selectors');

/**
 * Fetches job links as a user (logged in)
 */
async function fetchJobLinksUser({ page, location, keywords, remote, easyApply, jobTitle }) {
  const jobs = [];
  let i = 0;

  const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${i}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

  await page.goto(url, { waitUntil: "load" });

  const numJobsHandle = await page.waitForSelector(selectors.searchResultListText, { timeout: 5000 });
  const numJobs = await numJobsHandle.evaluate((el) => parseInt(el.innerText.replace(',', '')));
  const jobTitleRegExp = new RegExp(jobTitle, 'i');

  while (i < 1) {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${i}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

    await page.goto(url, { waitUntil: "load" });

    await page.waitForSelector(selectors.searchResultList, { timeout: 5000 });

    const jobListings = await page.$$(selectors.searchResultListItem);

    for (const job of jobListings) {
      try {

        const linkHandle = await job.waitForSelector(selectors.searchResultListItemLink, { timeout: 10000 });
        const [link, title] = await linkHandle.evaluate((el) => [el.href.trim(), el.innerText.trim()]);

        if (jobTitleRegExp.test(title)) {
          jobs.push(link);
          console.log(jobs.length + ' ' + keywords + ' remote jobs in ' + location + ' loaded, job title: ' + title);
        }
      } catch(e) {
        console.log(e);
      }
    }

    await wait(2000);

    i += jobListings.length;
  }

  return jobs;
}

module.exports = fetchJobLinksUser;