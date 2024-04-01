import { ElementHandle, Page } from 'puppeteer';

import selectors from '../selectors';
import changeTextInput from './changeTextInput';

async function insertHomeCity(page: Page, homeCity: string): Promise<void> {
  await changeTextInput(page, selectors.homeCity, homeCity);

  // click the background to make the country popup lose focus
  let background = await page.$(selectors.easyApplyFormBackground) as ElementHandle;
  await background.click({ clickCount: 1 });      
}

export default insertHomeCity;
