const ask = require('../utils/ask');
const selectors = require('../selectors');

async function login({ page, email, password }) {
  // Navigate to LinkedIn
  await page.goto('https://www.linkedin.com/', { waitUntil: 'load' });

  // Enter login credentials and submit the form
  await page.type(selectors.emailInput, email);
  await page.type(selectors.passwordInput, password);

  await page.click(selectors.loginSubmit);

  // Wait for the login to complete
  await page.waitForNavigation({ waitUntil: 'load' });

  const captcha = await page.$(selectors.captcha);

  if(captcha) {
    await ask('Please solve the captcha and then press enter');
    await page.goto('https://www.linkedin.com/', { waitUntil: 'load' });
  }

  console.log('Logged in to LinkedIn');

  await page.click(selectors.skipButton).catch(() => {});
}

module.exports = login;
