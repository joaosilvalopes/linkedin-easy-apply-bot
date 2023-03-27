import { Page } from 'puppeteer';

import fillMultipleChoiceFields from './fillMultipleChoiceFields';
import fillBoolean from './fillBoolean';
import fillTextFields from './fillTextFields';
import insertHomeCity from './insertHomeCity';
import insertPhone from './insertPhone';
import uploadDocs from './uploadDocs';
import { ApplicationFormData } from '../apply';

const noop = () => {};

async function fillFields(page: Page, formData: ApplicationFormData): Promise<void> {
  await insertHomeCity(page, formData.homeCity).catch(noop);

  await insertPhone(page, formData.phone).catch(noop);

  await uploadDocs(page, formData.cvPath, formData.coverLetterPath).catch(noop);

  const textFields = {
    ...JSON.parse(formData.textFields),
    ...JSON.parse(formData.yearsOfExperience),
  };

  await fillTextFields(page, textFields).catch(console.log);

  const booleans: { [key: string]: boolean } = Object.entries(JSON.parse(formData.booleans)).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value === 'true',
    }),
    {}
  );

  booleans['sponsorship'] = formData.requiresVisaSponsorship;

  booleans['follow'] = false;

  await fillBoolean(page, booleans).catch(console.log);

  const multipleChoiceFields = {
    ...JSON.parse(formData.languageProficiency),
    ...JSON.parse(formData.multipleChoiceFields),
  };

  await fillMultipleChoiceFields(page, multipleChoiceFields).catch(console.log);
}

export default fillFields;
