const wait = require("./wait");

async function apply({ page, link }) {
    await page.goto(link, { waitUntil: 'load' });

    await page.waitForSelector('button.jobs-apply-button:enabled', { visible: true, timeout: 5000 });
    await page.click('.jobs-apply-button');
}

module.exports = apply;
