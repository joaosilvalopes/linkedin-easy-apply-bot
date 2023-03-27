import { Page } from 'puppeteer';

import selectors from '../selectors';
import changeTextInput from './changeTextInput';

async function insertPhone(page: Page, phone: string): Promise<void> {
  await changeTextInput(page, selectors.phone, phone);
}

export default insertPhone;
