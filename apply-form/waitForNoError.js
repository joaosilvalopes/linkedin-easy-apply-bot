async function waitForNoError(page) {
    await page.waitForFunction(() => !document.querySelector("div[id*='error'] div[class*='error']"), { timeout: 1000 });
};

module.exports = waitForNoError;
