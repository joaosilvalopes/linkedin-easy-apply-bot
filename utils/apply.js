const noop = () => {};

async function changeTextInput(container, selector, value) {
    let input = container;

    if(selector) {
        input = await container.$(selector)
    }

    const previousValue = await input.evaluate(el => el.value);

    if(previousValue !== value) {
        await input.click({ clickCount: 3 }); // Select whole text to replace existing text
        await input.type(value);
    }
}

async function clickEasyApplyButton(page) {
    await page.waitForSelector('button.jobs-apply-button:enabled', { timeout: 10000 });
    await page.click('.jobs-apply-button');
}

async function uploadDocs(page, cvPath, coverLetterPath) {
    const docDivs = await page.$$("div[class*='jobs-document-upload']");

    for (const docDiv of docDivs) {
        const label = await docDiv.$("label[class*='jobs-document-upload']");
        const input = await docDiv.$("input[id*='easyApplyFormElement'][id*='jobApplicationFileUploadFormElement']");
        const text = await label.evaluate((el) => el.innerText.trim());

        if(text.includes("resume")) {
            await input.uploadFile(cvPath);
        } else if(text.includes("cover")) {
            await input.uploadFile(coverLetterPath);
        }
    }
}

async function clickNextButton(page) {
    await page.click("footer button[aria-label*='next'], footer button[aria-label*='Review']");

    await page.waitForSelector("footer button[aria-label*='Submit']:enabled, footer button[aria-label*='next']:enabled, footer button[aria-label*='Review']:enabled", { timeout: 10000 });
}

async function insertPhone(page, phone) {
    await changeTextInput(page, "input[id*='easyApplyFormElement'][id*='phoneNumber']", phone);
}

async function insertHomeCity(page, homeCity) {
    await changeTextInput(page, "input[id*='easyApplyFormElement'][id*='city-HOME-CITY']", homeCity);
}

async function insertLanguageProficiency(page, formData) {
    const languageProficiency = JSON.parse(formData.languageProficiency);
    const inputsByLabel = {};
    const inputs = await page.$$(".jobs-easy-apply-modal select");

    for (const input of inputs) {
        const id = await input.evaluate(el => el.id);
        const label = await page.$eval(`.jobs-easy-apply-modal label[for="${id}"]`, el => el.innerText);

        inputsByLabel[label] = input;
    }

    for (const [language, level] of Object.entries(languageProficiency)) {
        for (const [label, input] of Object.entries(inputsByLabel)) {
            if(label.toLowerCase().includes(language.toLowerCase())) {
                const option = await input.$$eval(`option`, (options, level) => {
                    const option = options.find(option => option.value.toLowerCase() === level.toLowerCase());

                    return option && option.value;
                }, level);

                if(option) {
                    await input.select(option);
                }

                continue;
            }
        }
    }
}

async function fillBoolean(page, booleans) {
    const fieldsets = await page.$$("fieldset");

    // fill 2 option radio button field sets
    for(const fieldset of fieldsets) {
        const options = await fieldset.$$('input[type="radio"]');

        if(options.length === 2) {
            const label = await fieldset.$eval('legend', el => el.innerText);

            for(const [labelRegex, value] of Object.entries(booleans)) {
                if(new RegExp(labelRegex, "i").test(label)) {
                    const input = await fieldset.$(`input[type='radio'][value='${value ? 'Yes' : 'No'}']`);
    
                    await input.click();
                }
            }
        }
    }

    // fill checkboxes
    const checkboxes = await page.$$('.jobs-easy-apply-modal input[type="checkbox"]');

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
    const selects = await page.$$(".jobs-easy-apply-modal select");

    for(const select of selects) {
        const options = (await select.$$('option'));

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

async function fillTextFields(page, textFields) {
    const inputs = await page.$$('.jobs-easy-apply-modal input[type="text"], .jobs-easy-apply-modal textarea');

    for(const input of inputs) {
        const id = await input.evaluate(el => el.id);
        const label = await page.$eval(`label[for="${id}"]`, el => el.innerText).catch(() => "");

        for(const [labelRegex, value] of Object.entries(textFields)) {
            if(new RegExp(labelRegex, "i").test(label)) {
                await changeTextInput(input, "", value.toString());
            }
        }
    }
}

async function fillFields(page, formData) {
    await insertHomeCity(page, formData.homeCity).catch(noop);

    await insertPhone(page, formData.phone).catch(noop);

    await uploadDocs(page, formData.cvPath, formData.coverLetterPath).catch(noop);

    await insertLanguageProficiency(page, formData).catch(console.log);

    const textFields = {
        ...JSON.parse(formData.textFields),
        ...JSON.parse(formData.yearsOfExperience)
    };

    await fillTextFields(page, textFields).catch(console.log);

    const booleans = Object.entries(JSON.parse(formData.booleans)).reduce((acc,[key, value]) => ({ ...acc, [key]: value === 'true' }), {});

    booleans.sponsorship = formData.requiresVisaSponsorship;

    booleans.follow = false;

    await fillBoolean(page, booleans).catch(console.log);
}

async function submit(page) {
    await page.click("footer button[aria-label*='Submit']");
}

async function apply({ page, link, formData }) {
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
        await page.waitForFunction(() => !document.querySelector("div[id*='error'] div[class*='error']"), { timeout: 1000 }).catch(noop);
    }

    try {
        //await submit(page);

        return;
    } catch { }
}

module.exports = apply;
