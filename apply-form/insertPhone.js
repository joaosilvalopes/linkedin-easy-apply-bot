const selectors = require('../selectors');
const changeTextInput = require('./changeTextInput');

async function insertPhone(page, phone) {
    await changeTextInput(page, selectors.phone, phone);
}

module.exports = insertPhone;
