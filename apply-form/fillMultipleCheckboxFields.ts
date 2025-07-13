import { Page } from 'puppeteer';
import selectors from '../selectors';
const noop = () => { };

interface MultipleCheckboxFields {
  [labelRegex: string]: string;
}

async function fillMultipleCheckboxFields(page: Page, multipleCheckboxFields: MultipleCheckboxFields): Promise<void> {

  await page.waitForSelector('fieldset[data-test*="checkbox-form-component"]', { timeout: 1000 }).catch(noop);

  const checkboxFieldsData = await page.$$eval('fieldset[data-test*="checkbox-form-component"]', fieldsets => {
    console.log('fieldsets:', fieldsets);
    return fieldsets.map(fieldset => {
      const legend = fieldset!.querySelector('legend')!.textContent!.trim();
      const options = Array.from(fieldset!.querySelectorAll('label')).map(label => label.textContent!.trim());
      return { legend, options };
    });
  });
  console.log('checkboxFields: ', checkboxFieldsData);

  // for (const checkboxField of checkboxFields) {
  //   const id = await checkboxField.evaluate((el) => el.id);
  //   const label = await page.$eval(`label[for="${id}"]`, (el) => el.innerText);
  
  //   for (const [labelRegex, value] of Object.entries(multipleCheckboxFields)) {
  //     if (new RegExp(labelRegex, 'i').test(label)) {
  //       const option = await checkboxField.$$eval(selectors.multipleCheckboxField, (options, value) => {
  //         const option = (options as HTMLOptionElement[]).find((option) => option.value.toLowerCase() === value.toLowerCase());
  //         console.log('option: ', option)
  //         return option && option.value;
  //       }, value);
  //       if (option) {
  //         await checkboxField.select(option);
  //       }
  //     }
  //   }
  // }
}

// async function fillMultipleCheckboxFields(page: Page, multipleCheckboxFields: MultipleCheckboxFields): Promise<void> {
//   // Assuming selectors.multipleCheckboxField points to the parent element containing checkboxes
//   const checkboxFields = await page.$$(selectors.multipleCheckboxField);

//   console.log('multipleCheckboxFieldSelector', selectors.multipleCheckboxField);
//   console.log('checkboxFields', checkboxFields);

//   for (const field of checkboxFields) {
//     const labels = await field.$$eval(selectors.multipleCheckboxes, (els) =>
//       els.map((el) => {
//         if (el.textContent) {
//           return el.textContent.trim()
//         }
//       })
//     );

//     for (const [labelRegex, values] of Object.entries(multipleCheckboxFields)) {
//       const regex = new RegExp(labelRegex, 'i');
      
//       labels.forEach(async (label, index) => {
//         if (label) {
//           if (regex.test(label)) {
//             for (const value of values) {
//               if (label.toLowerCase() === value.toLowerCase()) {
//                 // Click the corresponding checkbox for the matched label
//                 const checkboxLabel = await field.$(`${selectors.multipleCheckboxes}:nth-of-type(${index + 1})`);
//                 if (checkboxLabel) {
//                   await checkboxLabel.click();
//                 }
//               }
//             }
//           }
//         }
//       });
//     }
//   }
// }

export default fillMultipleCheckboxFields;
