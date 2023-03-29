import { Page } from "puppeteer";

async function unCheckFollowCompany(page: Page) {
  const checkbox = await page.$('input[type="checkbox"]#follow-company-checkbox');

  if(checkbox)
    await checkbox.evaluate(el => el.checked && el.click());
}

export default unCheckFollowCompany;
