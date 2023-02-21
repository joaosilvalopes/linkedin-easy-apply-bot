const wait = require("./wait");

const noop = () => {};

async function clickEasyApplyButton(page) {
    await page.waitForSelector('button.jobs-apply-button:enabled', { visible: true, timeout: 10000 });
    await page.click('.jobs-apply-button');
}

async function insertPhone(page, phone) {
    await page.type("input[id*='easyApplyFormElement'][id*='phoneNumber']", phone);
}

async function unFollowCompanyCheckbox(page) {
    await page.$eval('input#follow-company-checkbox', el => el.checked = false);
}

async function uploadDocs(page, cvPath, coverLetterPath) {
    const docDivs = await page.$$("div[class*='js-jobs-document-upload']");

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
    await page.click("button[data-easy-apply-next-button]");
}

async function insertHomeCity(page, homeCity) {
    await page.$eval("input[id*='easyApplyFormElement'][id*='city-HOME-CITY']", el => el.value = homeCity);
}

async function submit(page) {
    await page.click("footer button[class*='artdeco-button--primary']:not([data-easy-apply-next-button])");
}

async function fillFields(page) {
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

    await fillFields(page).catch(noop);

    await clickNextButton(page).catch(noop);

    await fillFields(page).catch(noop);

    await clickNextButton(page).catch(noop);

    await fillFields(page).catch(noop);

    await clickNextButton(page).catch(noop);

}

module.exports = apply;
