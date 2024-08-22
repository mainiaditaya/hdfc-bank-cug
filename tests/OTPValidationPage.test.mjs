/*

This file contains test cases for SEMI : OTP Validation Screen

--------------------------- Test Cases Covered -----------------------------
Before : 
      - Opening Pupeteers browser and a new page
Before Each : 
      - Page go to SEMI URL
      - Move to second page by entering test data and submitting
After : 
      - Close Browser
After Each : 
      - Console log completion of test


1) Title Check test : 
      - Checking if the title on the WelcomePage is "OTP Verification"
2) Form render test : 
      - Checking if a selector named 'form' is present on page
3) OTP Field Validation Test Case : 
      -> Test Case 1 : 
          - Input Alphabets 'ABCDEF', -> When read should show ''
      -> Test Case 2 : 
          - Input more than 6 digits, -> When read should show first 6 digits entered
4) OTP Field Input : 
      - Checking if OTP text field is present
      - Inputting correct test data and reading from text box to confirm text box validation
5) OTP Verification Button Submit test : 
      - Checking if OTP Submit button is present
      - Clicking the submit button 
      - Checking if the contents of next page show up.

*/


import { expect } from "chai";
import playwright from 'playwright';

describe('OTP Validation Page Test', function() {
  let browser;
  let page;
  console.log("Beginning the tests")
  let url = "http://localhost:3000/content/forms/af/hdfc_haf/cards/semi/forms/semi";

  //--------------------------------Before and After Statements --------------------------------------------
  beforeEach(async function(){
    // Logic that runs before each test
    console.log("Running test....");
    page.goto(url);
    
    //------------------------ Welcome Page ---------------------------

    // Type Mobile Number : 
    let identifier1 = "input#textinput-9788d1ff27"
    let test_input = "9876543890"
    await page.waitForSelector(identifier1);
    // Get the 'name' attribute of the input field to confirm it is working
    let name_attribute = await page.$eval(identifier1, el => el.getAttribute('name'));
    console.log('Name attribute:', name_attribute);
    // console.log(mobile_field)
    // console.log(nameAttribute)
    await page.type(identifier1, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier1, el => el.value);
    console.log('Input :', typedText);


    // Type Card last 4 digits : 
    // this.timeout(10000) // all tests in this suite get 10 seconds before timeout
    let identifier2 = "input#textinput-60e3d65023"

    let text_input = "2021"

    await page.waitForSelector(identifier2);
    // Get the 'name' attribute of the input field to confirm it is working
    let name_attribute2 = await page.$eval(identifier2, el => el.getAttribute('name'));
    console.log('Name attribute:', name_attribute2);
    // console.log(mobile_field)
    // console.log(nameAttribute)
    await page.type(identifier2, text_input)
    // Get the test mobile number currently typed into the input field
    const typedText2 = await page.$eval(identifier2, el => el.value);
    console.log('Input :', typedText2);


    // this.timeout(10000) // all tests in this suite get 10 seconds before timeout
    let identifier = "button#button-2024db0da1"
    console.log("Reached1");
    await page.waitForSelector(identifier);
    console.log("Reached2");
    // Get the 'name' attribute of the input field to confirm it is working
    const nameAttribute = await page.$eval(identifier, el => el.getAttribute('name'));
    console.log('Name attribute:', nameAttribute);
    // console.log(mobile_field)
    // console.log(nameAttribute)


    // Mouse click on any empty area of the screen to enable the button
    await page.mouse.click(10, 10);


    await page.click(identifier);
    console.log("Reached3");

  });

  // Set up the browser and page before running the tests
  before(async function() {
    browser = await playwright['chromium'].launch({headless:true});
    context = await browser.newContext();
    page = await context.newPage();
    // console.log("Page Specs : ")
    // console.info(page);
  });

  // Close the browser after all tests are done
  after(async function() {
    await browser.close();
  });

  afterEach(() => {
    // Logic that runs after every test
    console.log("Test run complete...")
  })


  //----------------------------------------- Test Cases -------------------------------------------------


  // ************* Title Check Test Case ******************
  it('Title Check', async function() {
    let identifier = "fieldset#panelcontainer-f64f581ce1 legend p b"
    await page.waitForSelector(identifier);
    const title = await page.$eval(identifier, b => b.textContent);
    console.log(title)
    await expect(title).to.include('OTP Verification');
  });

  
  // ************* Form Check Test Case ******************
  it('Form should render', async function(){
      await page.waitForSelector('form');
      const forms = await page.$$('form');
      await expect(forms.length).to.equal(1);
  });


  // ************** OTP Field Validation Test Case 1 *******************
  it('OTP Validation Test Case - 1', async function(){

    // Type of Input : Alphabets Only

    let identifier = "input#telephoneinput-7e59f4f31d"
    let test_input = "ABCDEF"
    await page.waitForSelector(identifier);
    
    await page.type(identifier, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.equal('');

  });

    // ************** OTP Field Validation Test Case 2 *******************
    it('OTP Validation Test Case - 2', async function(){

    // Type of Input : More than 6 digits

    let identifier = "input#telephoneinput-7e59f4f31d"
    let test_input = "1234567"
    await page.waitForSelector(identifier);
    
    await page.type(identifier, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.equal(test_input.slice(0,6));

  });


  // ************* OTP Input Test Case ******************
  it('OTP Correct Field Input', async function() {
    
    let identifier = "input#telephoneinput-7e59f4f31d"

    let text_input = "123456"

    await page.waitForSelector(identifier);
    // Get the 'name' attribute of the input field to confirm it is working
    const nameAttribute = await page.$eval(identifier, el => el.getAttribute('name'));
    console.log('Name attribute:', nameAttribute);
    // console.log(mobile_field)
    // console.log(nameAttribute)
    await page.type(identifier, text_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.equal(text_input);
  });

  // ************* Get OTP Button Submit Test Case ******************
  it('OTP Button Submit Test', async function() {
    // Enter OTP
    let identifier1 = "input#telephoneinput-7e59f4f31d"

    let text_input = "123456"

    await page.waitForSelector(identifier1);
    // Get the 'name' attribute of the input field to confirm it is working
    const name_attribute = await page.$eval(identifier1, el => el.getAttribute('name'));
    console.log('Name attribute:', name_attribute);

    await page.type(identifier1, text_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier1, el => el.value);
    console.log('Input :', typedText);


    let identifier = "button#button-410c1ebf4e"
    await page.waitForSelector(identifier);
    // Get the 'name' attribute of the input field to confirm it is working
    const nameAttribute = await page.$eval(identifier, el => el.getAttribute('name'));
    console.log('Name attribute:', nameAttribute);
    // console.log(mobile_field)
    // console.log(nameAttribute)

    // Mouse click on any empty area of the screen to enable the button
    await page.mouse.click(10, 10);

    await page.click(identifier);
    

    // ************ Check if contents of the next page are visible **************
    let next_identifier1 = "#text-708fa8a7ff p p"
    await page.waitForSelector(next_identifier1);
    const para1 = await page.$eval(next_identifier1, b => b.textContent);
    console.log(para1)
    await expect(para1).to.include('Eligible Transactions');

    let continue_btn_identifier = "button#button-569ecb6f8b"
    await page.waitForSelector(continue_btn_identifier);
    const continue_btn_name = await page.$eval(continue_btn_identifier, el=>el.getAttribute('name'));
    console.log('Submit Button Name attribute:', continue_btn_name);

  });

});
