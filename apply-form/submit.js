const selectors = require('../selectors');

async function submit(page) {
    await page.click(selectors.submit);
}

module.exports = submit;
