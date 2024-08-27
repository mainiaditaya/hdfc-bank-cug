/*

This file contains test cases for CCC : Welcome page

--------------------------- Test Cases Covered -----------------------------
Before : 
      - Opening Playwright browser and a new page
Before Each : 
      - Page go to url specified
After : 
      - Close Browser
After Each : 
      - Console log completion of test


1) Title Check test : 
      - Checking if the title on the WelcomePage is "CORPORATE_CREDIT_CARD"
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
import { titleCheck,visibilityCheck, radioIsChecked, radioClickAndCheck, textFieldValidation, dateFieldValidation,checkboxClickAndCheck } from '../utils/helperFunctions.mjs';


describe('Welcome Page Test', function() {
  let browser;
  let page;
  let context;
  console.log("Beginning the tests")
  // let url = "http://localhost:3000/"
  let url = "http://localhost:3000/content/forms/af/hdfc_haf/cards/corporatecreditcard/uat/hdfc?leadId=679171664&mode=dev";

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
  });


  //----------------------------------------- Test Cases -------------------------------------------------


  // ************* Title Check Test Case ******************
  it('Title Check', async function() {
    await titleCheck(page,'CORPORATE_CREDIT_CARD');
  });

  
  // ************* Form Check Test Case ******************
  it('Form should render', async function(){
    await visibilityCheck(page, 'form');
  });


  // ************** Mobile Field Validation Test Case 1 *******************
  it('Mobile Field Input Validation Test Case - 1', async function(){
    let identifier = "input#textinput-0803664c93"
    await visibilityCheck(page, identifier);

  });

  // ************** Radio Btn Pre-Select check *******************
  it('Radio Btn Pre-select Validation Test Case', async function(){

    // Checking if PAN Radio btn is pre-clicked
    let pan_identifier = "input#pandobselection-1";
    let pan_input_identifier = "input#textinput-44d61045c0"

    // Checking if pre-clicked and corresponding input field visible
    let panResults = await radioIsChecked(page,pan_identifier, true, pan_input_identifier);
    console.log('PAN Radio Btn pre_clicked : ', panResults.clicked);
    console.log("Pan Input field visible : " , panResults.correspondingFieldVisible);
    

    // Checking if DOB Radio Btn is pre-clicked and corresponding field visible
    let dob_identifier = "input#pandobselection";
    let dob_input_identifier = "input#datepicker-bcde0929a8"

    let dobResults = await radioIsChecked(page, dob_identifier, true, dob_input_identifier);  
    console.log('DOB Radio Btn pre_clicked : ', dobResults.clicked);
    console.log("DOB Input field visible : " , dobResults.correspondingFieldVisible);

    let condition = false;
    if(panResults.clicked == true && panResults.correspondingFieldVisible == true && dobResults.clicked == false && dobResults.correspondingFieldVisible == false ){
        condition = true;
    }

    await expect(condition).to.equal(true);

  });


  // ************** DOB Radio Btn Click check *******************
  it('Radio Btn Pre-select Validation Test Case', async function(){

    // Checking if DOB Input field is visible on Radio Button click
    let dob_identifier = "input#pandobselection";
    let dob_input_identifier = "input#datepicker-bcde0929a8"
    // await page.waitForSelector(dob_identifier);
    // const dob_radioButton = await page.click(dob_identifier);

    // // Checking if input box is showing
    // await page.waitForSelector(dob_input_identifier);
    // const dob_input_visible = await page.isVisible(dob_input_identifier);

    let dob_results = await radioClickAndCheck(page, dob_identifier, true, dob_input_identifier);

    console.log("DOB Input field visible : " , dob_results.correspondingFieldVisible);

    let condition = false;
    if(dob_results.correspondingFieldVisible == true ){
        condition = true;
    }

    await expect(condition).to.equal(true);

  });

  // ************** PAN Input Field Validation check *******************
  it('Radio Btn Pre-select Validation Test Case - 1', async function(){

    // Less than 10 characters
    let input = "AFZPK7190";
    
    // Checking if PAN Radio btn is pre-clicked
    let pan_identifier = "input#pandobselection-1";
    let pan_input_identifier = "input#textinput-44d61045c0"

    // Checking if pan radio is pre-clicked
    let pan_results = await radioIsChecked(page, pan_identifier, true, pan_input_identifier);
    console.log("Pan Input field visible : " , pan_results.correspondingFieldVisible);
    
    // // Check if error message shows up
    let error_message_selector = "div#textinput-44d61045c0-description";

    let results = await textFieldValidation(page, pan_input_identifier, input, null, true, error_message_selector, "Please enter a valid PAN Number")

    console.log("Error Message Visible : " , results.errorMessageVisible);
    console.log("Error Message : " , results.errorMessage);

    var condition = false;
    if(pan_results.clicked == true && pan_results.correspondingFieldVisible == true && results.errorMessageVisible == true && results.errorMessageEqual == true){
        condition = true;
    }

    await expect(condition).to.equal(true);

  });

  // ************** PAN Input Field Validation check - 2 *******************
  it('Radio Btn Pre-select Validation Test Case - 2', async function(){

    // More than 10 characters
    let input = "AFZPK7190ZZ";
    
    // Checking if PAN Radio btn is pre-clicked
    let pan_identifier = "input#pandobselection-1";
    let pan_input_identifier = "input#textinput-44d61045c0"

    // Checking if pan radio is pre-clicked
    let pan_results = await radioIsChecked(page, pan_identifier, true, pan_input_identifier);
    console.log("Pan Input field visible : " , pan_results.clicked);
    console.log("Pan Input field visible : " , pan_results.correspondingFieldVisible);

    let results = await textFieldValidation(page, pan_input_identifier, input, "AFZPK7190Z", false, null, null)

    var condition = false;
    if(pan_results.clicked == true && pan_results.correspondingFieldVisible == true  && results.inputEqual == true){
        condition = true;
    }

    await expect(condition).to.equal(true);

  });

  // ************** PAN Input Field Validation check - 3 *******************
  it('Radio Btn Pre-select Validation Test Case - 3', async function(){

    // Going against Regex
    let input = "1234567891";
    
     // Checking if PAN Radio btn is pre-clicked
     let pan_identifier = "input#pandobselection-1";
     let pan_input_identifier = "input#textinput-44d61045c0"
 
     // Checking if pan radio is pre-clicked
     let pan_results = await radioIsChecked(page, pan_identifier, true, pan_input_identifier);
     console.log("Pan Input field visible : " , pan_results.clicked);
     console.log("Pan Input field visible : " , pan_results.correspondingFieldVisible);
 
     let results = await textFieldValidation(page, pan_input_identifier, input, null, true, "div#textinput-44d61045c0-description", "Please enter a valid PAN Number")

     console.log("Error Message Visible : " , results.errorMessageVisible);
     console.log("Error Message : " , results.errorMessage);
 
     var condition = false;
     if(pan_results.clicked == true && pan_results.correspondingFieldVisible == true && results.errorMessageVisible == true && results.errorMessageEqual == true){
         condition = true;
     }
 
     await expect(condition).to.equal(true);

  });

 // ************** DOB Field Validation Test Case - 1 *******************
 it('DOB Field Validation Test Case - 1', async function(){

    // Since the type is supposed to be date - No manual validation cases for date is written.
    let input = '1992-09-10';
    
    // Checking if DOB Radio btn is pre-clicked
    let dob_identifier = "input#pandobselection";
    let dob_input_identifier = "input#datepicker-bcde0929a8"

    // Checking if pan radio is pre-clicked
    let dob_results = await radioClickAndCheck(page, dob_identifier, true, dob_input_identifier);
    console.log("DOB Input field visible : " , dob_results.clicked);

    await page.click(dob_input_identifier);

    let date_results = await dateFieldValidation(page, dob_input_identifier, input, "10 September, 1992");

     var condition = false;
     if(dob_results.correspondingFieldVisible == true  && date_results.dateEqual == true){
         condition = true;
     }
 
     await expect(condition).to.equal(true);

  });


  // ************** Privacy policy Checkbox Check *******************
  it('Privacy Policy Checkbox Check', async function(){
    let checkbox_identifier = "input#checkbox-adf937f03c";

    let privacy_policy_results = await checkboxClickAndCheck(page,checkbox_identifier);
    console.log("Is visible 1 : " , privacy_policy_results.checkboxVisible);

    await expect(privacy_policy_results.checkboxVisible).to.equal(true);

  });

  // ************** Authorize Call, SMS Checkbox check *******************
  it('Authorize Call, SMS Checkbox Check', async function(){
    let checkbox_identifier = "input#checkbox-d8055ad448";
    let authorize_call_sms_results = await checkboxClickAndCheck(page,checkbox_identifier);
    console.log("Is visible 1 : " , authorize_call_sms_results.checkboxVisible);

    await expect(authorize_call_sms_results.checkboxVisible).to.equal(true);

  });

  // ************** PAN based submission check *******************
  it('PAN based submission test case', async function(){
    // -------------------------------- PAN INPUT -----------------------------------
    // Correct Pan Input
    let input = "AIFPP5729A";
    
    // Checking if PAN Radio btn is pre-clicked
    let pan_identifier = "input#pandobselection-1";
    let pan_input_identifier = "input#textinput-44d61045c0"

    // Checking if pan radio is pre-clicked
    let pan_results = await radioIsChecked(page, pan_identifier, true, pan_input_identifier);
    console.log("Pan Input field visible : " , pan_results.clicked);
    console.log("Pan Input field visible : " , pan_results.correspondingFieldVisible);

    let results = await textFieldValidation(page, pan_input_identifier, input, input, false, null, null)


    // ---------------------- Privacy policy Checkbox -----------------------------
    let checkbox_identifier = "input#checkbox-adf937f03c";

    let privacy_policy_results = await checkboxClickAndCheck(page,checkbox_identifier);
    

    // ------------------------ GET OTP Button Click ------------------------------
    let btn_identifier = "button#button-989122ffd9";
    await page.click(btn_identifier);

    // ------------------------ Checking OTP Screen Contents ----------------------
    let title_identifier = "fieldset#panelcontainer-3a9f2d3eca legend p b";
    let otp_field_identifier = "input#telephoneinput-2a59d8bf22";
    let resent_otp_btn_identifier = "button#button-971bdf2fd8";
    let submit_btn_identifier = "button#button-b34bfd4c1d";

    await page.waitForSelector(title_identifier);
    const title_visible = await page.isVisible(title_identifier);
    console.log("OTP Page Title Visible? : " , title_visible);

    await page.waitForSelector(otp_field_identifier);
    const otp_field_visible = await page.isVisible(otp_field_identifier);
    console.log("OTP Field Visible? : " , otp_field_visible);
    
    await page.waitForSelector(resent_otp_btn_identifier);
    const resent_otp_btn_visible = await page.isVisible(resent_otp_btn_identifier);
    console.log("Resent OTP Button Visible? : " , resent_otp_btn_visible);

    await page.waitForSelector(submit_btn_identifier);
    const submit_btn_visible = await page.isVisible(submit_btn_identifier);
    console.log("Submit Button Visible? : " , submit_btn_visible);

    let condition = false;
    if(title_visible == true && otp_field_visible == true && resent_otp_btn_visible == true && submit_btn_visible == true){
        condition = true;
    }
    
    await expect(condition).to.equal(true);

  });

  // ************** DOB based submission check *******************
  it('DOB based submission test case', async function(){
    
    // -------------------------------- DOB INPUT -----------------------------------
    // Since the type is supposed to be date - No manual validation cases for date is written.
    let input = '1992-09-10';
    
    // Checking if DOB Radio btn is pre-clicked
    let dob_identifier = "input#pandobselection";
    let dob_input_identifier = "input#datepicker-bcde0929a8"

    // Checking if pan radio is pre-clicked
    let dob_results = await radioClickAndCheck(page, dob_identifier, true, dob_input_identifier);
    console.log("DOB Input field visible : " , dob_results.clicked);

    await page.click(dob_input_identifier);

    let date_results = await dateFieldValidation(page, dob_input_identifier, input, "10 September, 1992");


    // ---------------------- Privacy policy Checkbox -----------------------------
    let checkbox_identifier = "input#checkbox-adf937f03c";

    let privacy_policy_results = await checkboxClickAndCheck(page,checkbox_identifier);
    
    // ------------------------ GET OTP Button Click ------------------------------
    let btn_identifier = "button#button-989122ffd9";
    await page.click(btn_identifier);

    // ------------------------ Checking OTP Screen Contents ----------------------
    let title_identifier = "fieldset#panelcontainer-3a9f2d3eca legend p b";
    let otp_field_identifier = "input#telephoneinput-2a59d8bf22";
    let resent_otp_btn_identifier = "button#button-971bdf2fd8";
    let submit_btn_identifier = "button#button-b34bfd4c1d";

    await page.waitForSelector(title_identifier);
    const title_visible = await page.isVisible(title_identifier);
    console.log("OTP Page Title Visible? : " , title_visible);

    await page.waitForSelector(otp_field_identifier);
    const otp_field_visible = await page.isVisible(otp_field_identifier);
    console.log("OTP Field Visible? : " , otp_field_visible);
    
    await page.waitForSelector(resent_otp_btn_identifier);
    const resent_otp_btn_visible = await page.isVisible(resent_otp_btn_identifier);
    console.log("Resent OTP Button Visible? : " , resent_otp_btn_visible);

    await page.waitForSelector(submit_btn_identifier);
    const submit_btn_visible = await page.isVisible(submit_btn_identifier);
    console.log("Submit Button Visible? : " , submit_btn_visible);

    let condition = false;
    if(title_visible == true && otp_field_visible == true && resent_otp_btn_visible == true && submit_btn_visible == true){
        condition = true;
    }
    
    await expect(condition).to.equal(true);

  });

});
