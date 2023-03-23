async function changeTextInput(container, selector, value) {
    let input = container;

    if(selector) {
        input = await container.$(selector)
    }

    const previousValue = await input.evaluate(el => el.value);

    if(previousValue !== value) {
        await input.click({ clickCount: 3 }); // Select whole text to replace existing text
        await input.type(value);
    }
}

module.exports = changeTextInput;
