/*

This file contains test cases for SEMI : Welcome page

--------------------------- Test Cases Covered -----------------------------
Before : 
      - Opening Puppeteers browser and a new page
Before Each : 
      - Page go to url specified
After : 
      - Close Browser
After Each : 
      - Console log completion of test


1) Title Check test : 
      - Checking if the title on the WelcomePage is "SEMI"
2) Form render test : 
      - Checking if a selector named 'form' is present on page
3) Mobile Field Validation Test Case : 
      -> Test Case 1 : 
          - Input Alphabets 'ABCDEF', -> When read from field it should show ''
      -> Test Case 2 : 
          - Input more than 10 digits, -> When read from field it should show first 10 digits entered
4) Mobile Field Input : 
      - Checking if Mobile text field is present
      - Inputting correct test data and reading from text box to confirm text box validation
5) Card last 4 digits Field Validation Test Case : 
      -> Test Case 1 : 
          - Input Alphabets 'ABCD', -> When read should show ''
      -> Test Case 2 : 
          - Input more than 4 digits, -> When read should show first 4 digits entered
6) Card Last 4 digit Input : 
      - Checking if Card last 4 digits text field is present
      - Inputting test data and reading from text box to confirm text box validation
7) OTP Generate Button Submit test : 
      - Checking if OTP Generate button is present
      - Clicking the submit button 
      - Checking if the contents of next page show up.

*/


import { expect } from "chai";
import playwright from 'playwright';
import { titleCheck,visibilityCheck, radioIsChecked, radioClickAndCheck, textFieldValidation, dateFieldValidation,checkboxClickAndCheck, buttonClick, checkPageContents } from '../utils/helperFunctions.mjs';


describe('Welcome Page Test', function() {
  let browser;
  let page;
  let context;
  console.log("Beginning the tests")
  // let url = "http://localhost:3000/"
  let url = "http://localhost:3000/content/forms/af/hdfc_haf/cards/semi/forms/semi";

  //--------------------------------Before and After Statements --------------------------------------------
  beforeEach(() => {
    // Logic that runs before each test
    console.log("Running test....");
    page.goto(url);
  
  });

  // Set up the browser and page before running the tests
  before(async function() {
    browser = await playwright['chromium'].launch({headless:false});
    context = await browser.newContext();
    page = await context.newPage();
  });

  // Close the browser after all tests are done
  after(async function() {
    await browser.close();
  });

  afterEach(() => {
    // Logic that runs after every test
    console.log("Test run complete...")
    // page.screenshot({path: './example-chromium-${this.currentTest.title}-after.png'})
  })


  //----------------------------------------- Test Cases -------------------------------------------------


  // ************* Title Check Test Case ******************
  it('Title Check', async function() {
    await titleCheck(page,'SEMI');
  });

  
  // ************* Form Check Test Case ******************
  it('Form should render', async function(){
      await visibilityCheck(page, 'form');
  });


  // ************** Mobile Field Validation Test Case 1 *******************
  it('Mobile Field Input Validation Test Case - 1', async function(){

    // Type of Input : Alphabets Only

    let identifier = "input#textinput-9788d1ff27"
    let input = "ABCDEF"
    
    let results = await textFieldValidation(page, identifier, input, '', false, null, null);

    await expect(results.inputEqual).to.equal(true);

  });

   // ************** Mobile Field Validation Test Case 2 *******************
   it('Mobile Field Input Validation Test Case - 2', async function(){

    // Type of Input : More than 10 numbers

    let identifier = "input#textinput-9788d1ff27"
    let test_input = "97645323456"

    let results = await textFieldValidation(page, identifier, test_input, test_input.slice(0,10), false, null, null);

    await expect(results.inputEqual).to.equal(true);

  });

  
  // ************* Mobile Field Input Test Case ******************
  it('Mobile Field Correct Input', async function() {
    
    let identifier = "input#textinput-9788d1ff27"
    let test_input = "9876543890"
    
    let results = await textFieldValidation(page, identifier, test_input, test_input, false, null, null);

    await expect(results.inputEqual).to.equal(true);
  });


  // ************** Card last 4 digits Field Validation Test Case 1 *******************
  it('Card Input Validation Test Case - 1', async function(){

    // Type of Input : Alphabets Only

    let identifier = "input#textinput-60e3d65023"
    let test_input = "ABCD"

    let results = await textFieldValidation(page, identifier, test_input, '', false, null, null);

    await expect(results.inputEqual).to.equal(true);

  });

    // ************** Card last 4 digits Field Validation Test Case 2 *******************
    it('Card Input Validation Test Case - 2', async function(){

    // Type of Input : More than 4 digits

    let identifier = "input#textinput-60e3d65023"
    let test_input = "20100"

    let results = await textFieldValidation(page, identifier, test_input, test_input.slice(0,4), false, null, null);

    await expect(results.inputEqual).to.equal(true);

  });


  // ************* Card Last 4 Digits Input Test Case ******************
  it('Card Last 4 Digits Correct Field Input', async function() {
    
    // this.timeout(10000) // all tests in this suite get 10 seconds before timeout
    let identifier = "input#textinput-60e3d65023"

    let test_input = "2021"

    let results = await textFieldValidation(page, identifier, test_input, test_input, false, null, null);

    await expect(results.inputEqual).to.equal(true);
  });

  // ************* Get OTP Button Submit Test Case ******************
  it('OTP Button Submit Test', async function() {
    
    // --------------------------------- MOBILE NUMBER ENTER -----------------------------------
    let identifier1 = "input#textinput-9788d1ff27"
    let test_input = "9876543890"
    let mobile_results = await textFieldValidation(page, identifier1, test_input, test_input, false, null, null);

    // --------------------------------- CARD LAST 4 DIGITS ------------------------------------ 
    let identifier2 = "input#textinput-60e3d65023"
    let text_input = "2021"
    let card_results = await textFieldValidation(page, identifier2, text_input, text_input, false, null, null);

    
    // --------------------------------- BUTTON CLICK --------------------------------------------
    let identifier = "button#button-2024db0da1"
    await buttonClick(page, identifier);
    
    // --------------------------------- CHECK NEXT PAGE CONTENTS --------------------------------
    let next_page_contents = ["input#telephoneinput-7e59f4f31d", "button#button-410c1ebf4e"];
    await checkPageContents(page, next_page_contents);
  });

});
