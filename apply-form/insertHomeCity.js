const selectors = require('../selectors');
const changeTextInput = require('./changeTextInput');

async function insertHomeCity(page, homeCity) {
    await changeTextInput(page, selectors.homeCity, homeCity);
}

module.exports = insertHomeCity;
