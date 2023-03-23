const selectors = require('../selectors');

async function fillMultipleChoiceFields(page, multipleChoiceFields) {
    const selects = await page.$$(selectors.select);

    for(const select of selects) {
        const id = await select.evaluate(el => el.id);
        const label = await page.$eval(`label[for="${id}"]`, el => el.innerText);

        for(const [labelRegex, value] of Object.entries(multipleChoiceFields)) {
            if(new RegExp(labelRegex, "i").test(label)) {
                const option = await select.$$eval(selectors.option, (options, value) => {
                    const option = options.find(option => option.value.toLowerCase() === value.toLowerCase());

                    return option && option.value;
                }, value);

                if(option) {
                    await select.select(option);
                }
            }
        }
    }
}

module.exports = fillMultipleChoiceFields;
