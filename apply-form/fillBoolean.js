const selectors = require('../selectors');

async function fillBoolean(page, booleans) {
    const fieldsets = await page.$$(selectors.fieldset);

    // fill 2 option radio button field sets
    for(const fieldset of fieldsets) {
        const options = await fieldset.$$(selectors.radioInput);

        if(options.length === 2) {
            const label = await fieldset.$eval('legend', el => el.innerText);

            for(const [labelRegex, value] of Object.entries(booleans)) {
                if(new RegExp(labelRegex, "i").test(label)) {
                    const input = await fieldset.$(`${selectors.radioInput}[value='${value ? 'Yes' : 'No'}']`);
    
                    await input.click();
                }
            }
        }
    }

    // fill checkboxes
    const checkboxes = await page.$$(selectors.checkbox);

    for(const checkbox of checkboxes) {
        const id = await checkbox.evaluate(el => el.id);
        const label = await page.$eval(`label[for="${id}"]`, el => el.innerText);

        for(const [labelRegex, value] of Object.entries(booleans)) {
            if(new RegExp(labelRegex, "i").test(label)) {
                const previousValue = await checkbox.evaluate(el => el.checked);

                if(value !== previousValue) {
                    await checkbox.evaluate(el => el.click());
                }
            }
        }
    }

    // fill 2 option selects
    const selects = await page.$$(selectors.select);

    for(const select of selects) {
        const options = (await select.$$(selectors.option));

        options.shift();

        if(options.length === 2) {
            const id = await select.evaluate(el => el.id);
            const label = await page.$eval(`label[for="${id}"]`, el => el.innerText);

            for(const [labelRegex, value] of Object.entries(booleans)) {
                if(new RegExp(labelRegex, "i").test(label)) {
                    const option = await options[value ? 0 : 1].evaluate((el) => el.value);

                    await select.select(option);
    
                    continue;
                }
            }
        }
    }
}

module.exports = fillBoolean;
