const selectors = require('../selectors');

async function clickNextButton(page) {
    await page.click(selectors.nextButton);

    await page.waitForSelector(selectors.enabledSubmitOrNextButton, { timeout: 10000 });
}

module.exports = clickNextButton;
