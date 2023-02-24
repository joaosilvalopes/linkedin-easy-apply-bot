const noop = () => {};

async function changeTextInput(container, selector, value) {
    const input = await container.$(selector);
    const previousValue = await input.evaluate(el => el.value);

    if(previousValue !== value) {
        await input.click({ clickCount: 3 }); // Select whole text to replace existing text
        await input.type(value);
    }
}

async function clickEasyApplyButton(page) {
    await page.waitForSelector('button.jobs-apply-button:enabled', { visible: true, timeout: 10000 });
    await page.click('.jobs-apply-button');
}

async function insertPhone(page, phone) {
    await changeTextInput(page, "input[id*='easyApplyFormElement'][id*='phoneNumber']", phone);
}

async function unFollowCompanyCheckbox(page) {
    await page.$eval('input#follow-company-checkbox', el => el.checked = false);
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

    await page.waitForSelector("footer button[aria-label*='Submit']:enabled, footer button[aria-label*='next']:enabled, footer button[aria-label*='Review']:enabled", { visible: true, timeout: 10000 });
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

async function insertYearsOfExperience(page, formData) {
    const yoe = JSON.parse(formData.yearsOfExperience);
    const inputsByLabel = {};
    const inputs = await page.$$(".jobs-easy-apply-modal input[type='text']");

    for (const input of inputs) {
        const id = await input.evaluate(el => el.id);
        const label = await page.$eval(`.jobs-easy-apply-modal label[for="${id}"]`, el => el.innerText);

        inputsByLabel[label] = input;
    }

    for (const [skill, years] of Object.entries(yoe)) {
        for (const [label, input] of Object.entries(inputsByLabel)) {
            if(label.toLowerCase().includes(skill.toLowerCase())) {
                const previousValue = await input.evaluate(el => el.value);
                const newValue = years.toString();

                if(previousValue !== newValue) {
                    await input.click({ clickCount: 3 }); // Select whole text to replace existing text
                    await input.type(newValue);
                }

                continue;
            }
        }
    }
}

async function insertRequiresVisaSponsorship(page, requiresVisaSponsorship) {
    const fieldsets = await page.$$("fieldset");


    for (const fieldset of fieldsets) {
        const label = await fieldset.$eval('legend', el => el.innerText);

        if(label.toLowerCase().includes('sponsorship')) {
            const input = await fieldset.$(`input[type='radio'][value='${requiresVisaSponsorship ? 'Yes' : 'No'}']`);

            await input.click();
        }
    }
}

async function fillFields(page, formData) {
    await insertHomeCity(page, formData.homeCity).catch(noop);

    await insertPhone(page, formData.phone).catch(noop);

    await unFollowCompanyCheckbox(page).catch(noop);

    await uploadDocs(page, formData.cvPath, formData.coverLetterPath).catch(noop);

    await insertYearsOfExperience(page, formData).catch(console.log);

    await insertLanguageProficiency(page, formData).catch(console.log);

    await insertRequiresVisaSponsorship(page, formData.requiresVisaSponsorship).catch(console.log);
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

    await fillFields(page, formData).catch(noop);

    await clickNextButton(page).catch(noop);

    await fillFields(page, formData).catch(noop);

    await clickNextButton(page).catch(noop);

    await fillFields(page, formData).catch(noop);

    await clickNextButton(page).catch(noop);

    try {
        //await submit(page);

        return;
    } catch { }
}

module.exports = apply;
