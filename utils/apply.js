const noop = () => {};

async function clickEasyApplyButton(page) {
    await page.waitForSelector('button.jobs-apply-button:enabled', { visible: true, timeout: 10000 });
    await page.click('.jobs-apply-button');
}

async function insertPhone(page, phone) {
    await page.$eval("input[id*='easyApplyFormElement'][id*='phoneNumber']", el => el.value = phone);
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
        console.log(text);

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
    await page.$eval("input[id*='easyApplyFormElement'][id*='city-HOME-CITY']", el => el.value = homeCity);
}

async function submit(page) {
    await page.click("footer button[aria-label*='Submit']");
}
/*
async function insertYearsOfExperience(page, formData) {
    const yoe = JSON.parse(YEARS_OF_EXPERIENCE);
    const inputLabels = [];
    const inputs = await page.$$("jobs-easy-apply-modal input[type='text']");

    for (const input of inputs) {
        $('label[for="foo"]');
    }

    for (const [skill, years] of Object.values(yoe)) {
        for (const input of inputs) {
            
        }
    }

}*/

async function fillFields(page, formData) {
    await insertHomeCity(page, formData.homeCity).catch(noop);

    await insertPhone(page, formData.phone).catch(noop);

    await unFollowCompanyCheckbox(page).catch(noop);

    await uploadDocs(page, formData.cvPath, formData.coverLetterPath).catch(noop);
}

async function apply({ page, link, formData }) {
    await page.goto(link, { waitUntil: 'load', timeout: 60000 });

    try {
        await clickEasyApplyButton(page);
    } catch {
        console.log("Easy apply button not found in posting: " + link);
        return;
    }

    /*try {
        //await submit(page);

        return;
    } catch { }*/

    await fillFields(page, formData).catch(noop);

    await clickNextButton(page).catch(noop);

    await fillFields(page, formData).catch(noop);

    await clickNextButton(page).catch(noop);

    await fillFields(page, formData).catch(noop);

    await clickNextButton(page).catch(noop);

}

module.exports = apply;
