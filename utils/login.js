const rlp = require('readline');

const rl = rlp.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(str) {
  return new Promise(resolve => {
    rl.question(str, resolve);
  });
}

async function login({ page, email, password }) {
  // Navigate to LinkedIn
  await page.goto('https://www.linkedin.com/', { waitUntil: 'load' });

  // Enter login credentials and submit the form
  await page.type('#session_key', email);
  await page.type('#session_password', password);
  await page.click('.sign-in-form__submit-button');

  // Wait for the login to complete
  await page.waitForNavigation({ waitUntil: 'load' });

  const captcha = await page.$("#captcha-internal");

  if(captcha) {
    await ask('Please solve the captcha and then press enter');
    await page.goto('https://www.linkedin.com/', { waitUntil: 'load' });
  }

  console.log('Logged in to LinkedIn');

  try {
    await page.click('button[text()="Skip"]');
  } catch { }
}

module.exports = login;