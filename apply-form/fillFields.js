const fillMultipleChoiceFields = require('./fillMultipleChoiceFields');
const fillBoolean = require('../apply-form/fillBoolean');
const fillTextFields = require('../apply-form/fillTextFields');
const insertHomeCity = require('../apply-form/insertHomeCity');
const insertPhone = require('../apply-form/insertPhone');
const uploadDocs = require('../apply-form/uploadDocs');

const noop = () => {};

async function fillFields(page, formData) {
    await insertHomeCity(page, formData.homeCity).catch(noop);

    await insertPhone(page, formData.phone).catch(noop);

    await uploadDocs(page, formData.cvPath, formData.coverLetterPath).catch(noop);

    const textFields = {
        ...JSON.parse(formData.textFields),
        ...JSON.parse(formData.yearsOfExperience)
    };

    await fillTextFields(page, textFields).catch(console.log);

    const booleans = Object.entries(JSON.parse(formData.booleans)).reduce((acc,[key, value]) => ({ ...acc, [key]: value === 'true' }), {});

    booleans.sponsorship = formData.requiresVisaSponsorship;

    booleans.follow = false;

    await fillBoolean(page, booleans).catch(console.log);

    const multipleChoiceFields = {
        ...JSON.parse(formData.languageProficiency),
        ...JSON.parse(formData.multipleChoiceFields)
    };

    await fillMultipleChoiceFields(page, multipleChoiceFields).catch(console.log);
}

module.exports = fillFields;
