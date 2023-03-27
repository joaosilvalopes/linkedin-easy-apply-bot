import { Page } from 'puppeteer';

import ask from '../utils/ask';
import selectors from '../selectors';

interface Params {
  page: Page;
  email: string;
  password: string;
}

async function login({ page, email, password }: Params): Promise<void> {
  // Navigate to LinkedIn
  await page.goto('https://www.linkedin.com/', { waitUntil: 'load' });

  // Enter login credentials and submit the form
  await page.type(selectors.emailInput, email);
  await page.type(selectors.passwordInput, password);

  await page.click(selectors.loginSubmit);

  // Wait for the login to complete
  await page.waitForNavigation({ waitUntil: 'load' });

  const captcha = await page.$(selectors.captcha);

  if (captcha) {
    await ask('Please solve the captcha and then press enter');
    await page.goto('https://www.linkedin.com/', { waitUntil: 'load' });
  }

  console.log('Logged in to LinkedIn');

  await page.click(selectors.skipButton).catch(() => { });
}

export default login;
