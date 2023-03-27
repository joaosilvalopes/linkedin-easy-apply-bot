import { ElementHandle, Page } from 'puppeteer';

async function changeTextInput(container: ElementHandle | Page, selector: string, value: string): Promise<void> {
  let input = selector ? await container.$(selector) : container as ElementHandle;

  if (!input) {
    throw `Couldn't find element with selector ${selector}`;
  }

  const previousValue = await input.evaluate((el) => (el as HTMLInputElement).value);

  if (previousValue !== value) {
    await input.click({ clickCount: 3 }); // Select whole text to replace existing text
    await input.type(value);
  }
}

export default changeTextInput;
