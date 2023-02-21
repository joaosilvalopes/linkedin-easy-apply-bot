const wait = require("./wait");

/**
 * Fetches job links as a guest user (not logged in)
 */
async function fetchJobLinksGuest({ page, location, keywords, remote, easyApply }) {
    const jobLinks = [];
    const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}&start=${jobLinks.length}${remote ? '&f_WRA=true' : ''}${easyApply ? '&f_AL=true' : ''}`;
  
    await page.goto(url, { waitUntil: "load" });
  
    // Scroll down to the bottom of the page to load more job listings
    const numJobs = await page.$eval(".results-context-header__job-count", el => parseInt(el.innerText.replace(',', '')));
    let numJobsDisplayed = await page.$$(".jobs-search__results-list li").then(el => el.length);
    while (numJobsDisplayed < numJobs) {
      try {
        await page.click(".infinite-scroller__show-more-button:enabled");
        await page.waitForSelector(".infinite-scroller__show-more-button:enabled", { visible: true, timeout: 3000 });
        numJobsDisplayed = await page.$$(".jobs-search__results-list li").then(el => el.length);
      } catch (err) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        numJobsDisplayed = await page.$$(".jobs-search__results-list li").then(el => el.length);
      }
      console.log(numJobsDisplayed + '/' + numJobs + ' ' + keywords + ' remote jobs in ' + location + ' loaded');
      await wait(2000);
    }
  
    // Extract job information from the loaded job listings
    const jobListings = await page.$$(".jobs-search__results-list li");
  
    for(const job of jobListings) {
      //console.log(await job.getProperty('innerHTML').then((property) => property.jsonValue()));
      const title = await job.$eval(".base-search-card__title", (el) => el.innerText.trim());
      const company = await job.$eval(".base-search-card__subtitle", (el) => el.innerText.trim());
      const location = await job.$eval(".job-search-card__location", (el) => el.innerText.trim());
      const link = await job.$eval("a", (el) => el.href);
  
      jobLinks.push({link, location, company, title });
    };
  
    return jobLinks;
  }

module.exports = fetchJobLinksGuest;