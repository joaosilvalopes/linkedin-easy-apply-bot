const wait = require("./wait");

/**
 * Fetches job links as a guest user (not logged in)
 */
async function fetchJobLinksUser({ page, location, keywords }) {
    const jobs = [];
  
    for (let pageNum = 1; ; pageNum++) {
      const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&pageNum=${pageNum}&f_WRA=true`;
  
      await page.goto(url, { waitUntil: "load" });
  
      await page.waitForSelector('.jobs-search-results-list', { visible: true, timeout: 5000 })
        .catch(() => { return; });
  
      const newJobs = await page.$$eval('.jobs-search-results-list li.jobs-search-results__list-item', (jobs) => {
        return jobs.map((job) => {
          const title = job.querySelector('.job-card-list__title').innerText;
          const company = job.querySelector('.job-card-container__company-name').innerText;
          const location = job.querySelector('.job-card-container__metadata-item').innerText;
          const link = job.querySelector('a.job-card-list__title').href;
          return { title, company, location, link };
        });
      });
  
      if (newJobs.length === 0) {
        break;
      }
  
      jobs.push(...newJobs);
    }
  
    return jobs;
  }

module.exports = fetchJobLinksUser;