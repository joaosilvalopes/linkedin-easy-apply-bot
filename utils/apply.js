const wait = require("./wait");

async function apply({ page, link, formData }) {
    await page.goto(link, { waitUntil: 'load' });

    await page.waitForSelector('button.jobs-apply-button:enabled', { visible: true, timeout: 5000 });
    await page.click('.jobs-apply-button');

    await page.type("input[id*='easyApplyFormElement'][id*='phoneNumber']", formData.phone);

    try {
        await page.click('button[data-easy-apply-next-button]');
    } catch {}

    try {
        const fileInput = await page.$("input[id*='easyApplyFormElement'][id*='jobApplicationFileUploadFormElement']");
        await fileInput.uploadFile(formData.cvPath); // Upload your resume
    } catch {}
}

module.exports = apply;
