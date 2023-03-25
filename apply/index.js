const selectors = require('../selectors');
const fillFields = require('../apply-form/fillFields');
const waitForNoError = require('../apply-form/waitForNoError');
const clickNextButton = require('../apply-form/clickNextButton');

const noop = () => {};

async function clickEasyApplyButton(page) {
    await page.waitForSelector(selectors.easyApplyButtonEnabled, { timeout: 10000 });
    await page.click(selectors.easyApplyButtonEnabled);
}

async function apply({ page, link, formData, shouldSubmit }) {
    await page.goto(link, { waitUntil: 'load', timeout: 60000 });

    try {
        await clickEasyApplyButton(page);
    } catch {
        console.log("Easy apply button not found in posting: " + link);
        return;
    }

    let maxPages = 5;

    while(maxPages--) {
        await fillFields(page, formData).catch(noop);

        await clickNextButton(page).catch(noop);

        await waitForNoError(page).catch(noop);
    }

    const submitButton = await page.$(selectors.submit);

    if(!submitButton) {
        throw 'error';
    }

    if(shouldSubmit) {
        await submitButton.click();
    }
}

module.exports = apply;
