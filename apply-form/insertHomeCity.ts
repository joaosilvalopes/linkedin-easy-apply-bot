import { Page } from 'puppeteer';

import selectors from '../selectors';
import changeTextInput from './changeTextInput';

async function insertHomeCity(page: Page, homeCity: string): Promise<void> {
  await changeTextInput(page, selectors.homeCity, homeCity);
}

export default insertHomeCity;
