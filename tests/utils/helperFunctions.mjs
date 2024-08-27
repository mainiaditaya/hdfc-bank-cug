import { expect } from "chai";

// -------------------------------------- UTIL HELPER FUNCTIONS -------------------------------------------------------------

/* 
    Function : Check if the title text equals a certain string
*/

export async function titleCheck(page, check){
    await page.waitForSelector('form');

    console.log("Reached");
    
    // Get the title of the page
    const title = await page.title();
    console.log(title)
    await expect(title).to.equal(check);
};

/* 
    Function : Check if the tag text equals a certain string
*/

export async function textContentCheck(page, identifier, check){
    await page.waitForSelector(identifier);
    const textContent = await page.$eval(identifier, b => b.textContent);
    await expect(textContent).to.include(check);
}

/* 
    Function : Check if an identifier is visible
*/

export async function visibilityCheck(page,identifier) {
    await page.waitForSelector(identifier);
    const isVisible = await page.isVisible(identifier);
    await expect(isVisible).to.equal(true);
};


/* 
    Function : Check if a radio button is checked
    Optional : Check if a corresponding field is visible.
*/
export async function radioIsChecked(page, identifier, correspondingCheck, correspondingIdentifier) {
    await page.waitForSelector(identifier);
    const radioButton = await page.$(identifier);
    const clicked = await radioButton.isChecked();

    if(correspondingCheck == true){
        // Checking if input box is showing
        const correspondingFieldVisible = await page.isVisible(correspondingIdentifier);
        console.log(clicked, correspondingFieldVisible);
        return { 
            clicked : clicked, 
            correspondingFieldVisible : correspondingFieldVisible };
    }

    return {clicked : clicked};
}

/*

    Function : Click a radio button
    Optional : Check if a corresponding field is visible

*/

export async function radioClickAndCheck(page, identifier, corresponding, correspondingIdentifier){
    await page.waitForSelector(identifier);
    const radioButton = await page.click(identifier);

    let results = await radioIsChecked(page, identifier, corresponding, correspondingIdentifier);
    return results;
}


/*

    Function : Input to a text field

*/

export async function textFieldValidation(page, identifier, input, expected, errorExpected, errorMessageIdentifier, errorMessageExpected){
    // Field Validation Check
    await page.type(identifier, input);
    // Mouse click on any empty area of the screen to enable the button
    await page.mouse.click(10, 10);


    if(errorExpected == true){
        // Check if error message shows up
        await page.waitForSelector(errorMessageIdentifier);
        const error_message_visible = await page.isVisible(errorMessageIdentifier);
        const typedText = await page.innerText(errorMessageIdentifier);
        return {
            errorMessageEqual : (typedText == errorMessageExpected),
            errorMessageVisible : error_message_visible,
            errorMessage : typedText
        };
    }
    else{
        const typedText = await page.$eval(identifier, el => el.value);
        console.log('Input :', typedText);
        return {
            inputEqual : (typedText==expected),
            input : typedText
        };
    }

}


/*

    Function : Input to a date field

*/

export async function dateFieldValidation(page, identifier, input, expected){
    // Field Validation Check
    // Type a date into the input field
    console.log("Reched");
    await page.fill(identifier, input); // Replace with your actual selector and date

    // Mouse click on any empty area of the screen to enable the button
    await page.mouse.click(10, 10);
    
    // Read the value
    const dateValue = await page.inputValue(identifier);
    return {
        dateVal : dateValue,
        dateEqual : (dateValue == expected)
    };
    
}

/*

    Function : Click a Checkbox

*/

export async function checkboxClickAndCheck(page, identifier){
    
    await page.waitForSelector(identifier);
    await page.click(identifier);
    const checkbox = await page.$(identifier);
    let is_visible = await checkbox.isChecked();

    return {
        checkboxVisible : is_visible
    };
    
};


/*

    Function : Click a button

*/
export async function buttonClick(page, identifier){
    await page.waitForSelector(identifier);
    await page.mouse.click(10, 10);
    await page.click(identifier);
};


/*

    Function : Check if the next page's contents are visible

*/
export async function checkPageContents(page, page_contents) {
    for (const identifier in page_contents){
        visibilityCheck(page, identifier);
    }

};

