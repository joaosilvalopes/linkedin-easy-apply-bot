const wait = require("./wait");

/**
 * Fetches job links as a user (logged in)
 */
async function fetchJobLinksUser({ page, location, keywords, remote, easyApply, jobTitle }) {
  const jobs = [];
  let i = 0;

  const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${i}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

  await page.goto(url, { waitUntil: "load" });

  const numJobsHandle = await page.waitForSelector('small.jobs-search-results-list__text', { timeout: 5000 });
  const numJobs = await numJobsHandle.evaluate((el) => parseInt(el.innerText.replace(',', '')));

  while (i < 64) {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${i}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;

    await page.goto(url, { waitUntil: "load" });

    await page.waitForSelector('.jobs-search-results-list', { timeout: 5000 });

    const jobListings = await page.$$(".jobs-search-results-list li.jobs-search-results__list-item");

    for (const job of jobListings) {
      try {

        const linkHandle = await job.waitForSelector('a.job-card-list__title', { timeout: 10000 });
        const [link, title] = await linkHandle.evaluate((el) => [el.href.trim(), el.innerText.trim()]);

        if (new RegExp(jobTitle, 'i').test(title)) {
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