const wait = require("./wait");

/**
 * Fetches job links as a user (logged in)
 */
async function fetchJobLinksUser({ page, location, keywords, remote, easyApply }) {
  const jobLinks = [];

  const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${jobLinks.length}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

  await page.goto(url, { waitUntil: "load" });

  const numJobsHandle = await page.waitForSelector('small.jobs-search-results-list__text', { visible: true, timeout: 5000 });
  const numJobs = await numJobsHandle.evaluate((el) => parseInt(el.innerText.replace(',', '')));

  while (jobLinks.length < numjobs) {
    try {
      const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${jobLinks.length}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

      await page.goto(url, { waitUntil: "load" });

      await page.waitForSelector('.jobs-search-results-list', { visible: true, timeout: 5000 });

      const jobListings = await page.$$(".jobs-search-results-list li.jobs-search-results__list-item");

      for (const job of jobListings) {
        /*const title = await job.$eval('.job-card-list__title', (el) => el.innerText.trim());
        const company = await job.$eval('.job-card-container__company-name', (el) => el.innerText.trim());
        const location = await job.$eval('.job-card-container__metadata-item', (el) => el.innerText.trim());*/
        const linkHandle = await job.waitForSelector('a.job-card-list__title', { visible: true, timeout: 10000 });
        const link = await linkHandle.evaluate((el) => el.href.trim());

        jobLinks.push(link);
        console.log(jobLinks.length + '/' + numJobs + ' ' + keywords + ' remote jobs in ' + location + ' loaded');
      }
    } catch {}
    await wait(5000);
  }

  return jobLinks;
}

module.exports = fetchJobLinksUser;