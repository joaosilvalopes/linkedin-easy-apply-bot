import { Page } from 'puppeteer';

import selectors from '../selectors';

async function clickNextButton(page: Page): Promise<void> {
  await page.click(selectors.nextButton);

  await page.waitForSelector(selectors.enabledSubmitOrNextButton, { timeout: 10000 });
}

export default clickNextButton;
