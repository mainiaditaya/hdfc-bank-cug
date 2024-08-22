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
    // console.log("Browser specs : ")
    // console.info(browser);
    // console.info(context)
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
    // page.screenshot({path: './example-chromium-${this.currentTest.title}-after.png'})
  })


  //----------------------------------------- Test Cases -------------------------------------------------


  // ************* Title Check Test Case ******************
  it('Title Check', async function() {
    // await page.waitForTimeout(10000);
    await page.waitForSelector('form');
    // await page.waitForSelector('title');
    console.log("Reached");
    // const title = await page.$$('title');
    // console.log(title)
    // await expect(title).to.include('SEMI');
  });

  
  // ************* Form Check Test Case ******************
  it('Form should render', async function(){
      await page.waitForSelector('form');
      const forms = await page.$$('form');
      await expect(forms.length).to.equal(1);
  });


  // ************** Mobile Field Validation Test Case 1 *******************
  it('Mobile Field Input Validation Test Case - 1', async function(){

    // Type of Input : Alphabets Only

    let identifier = "input#textinput-9788d1ff27"
    let test_input = "ABCDEF"
    await page.waitForSelector(identifier);
    
    await page.type(identifier, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.equal('');

  });

   // ************** Mobile Field Validation Test Case 2 *******************
   it('Mobile Field Input Validation Test Case - 2', async function(){

    // Type of Input : More than 10 numbers

    let identifier = "input#textinput-9788d1ff27"
    let test_input = "97645323456"
    await page.waitForSelector(identifier);
    
    await page.type(identifier, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.equal(test_input.slice(0,10));

  });

  
  // ************* Mobile Field Input Test Case ******************
  it('Mobile Field Correct Input', async function() {
    
    let identifier = "input#textinput-9788d1ff27"
    let test_input = "9876543890"
    await page.waitForSelector(identifier);
    // Get the 'name' attribute of the input field to confirm it is working
    const nameAttribute = await page.$eval(identifier, el => el.getAttribute('name'));
    console.log('Name attribute:', nameAttribute);
    // console.log(mobile_field)
    // console.log(nameAttribute)
    await page.type(identifier, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.include(test_input);
  });


  // ************** Card last 4 digits Field Validation Test Case 1 *******************
  it('Card Input Validation Test Case - 1', async function(){

    // Type of Input : Alphabets Only

    let identifier = "input#textinput-60e3d65023"
    let test_input = "ABCD"
    await page.waitForSelector(identifier);
    
    await page.type(identifier, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.equal('');

  });

    // ************** Card last 4 digits Field Validation Test Case 2 *******************
    it('Card Input Validation Test Case - 2', async function(){

    // Type of Input : More than 4 digits

    let identifier = "input#textinput-60e3d65023"
    let test_input = "20100"
    await page.waitForSelector(identifier);
    
    await page.type(identifier, test_input)
    // Get the test mobile number currently typed into the input field
    const typedText = await page.$eval(identifier, el => el.value);
    console.log('Input :', typedText);

    await expect(typedText).to.equal(test_input.slice(0,4));

  });


  // ************* Card Last 4 Digits Input Test Case ******************
  it('Card Last 4 Digits Correct Field Input', async function() {
    
    // this.timeout(10000) // all tests in this suite get 10 seconds before timeout
    let identifier = "input#textinput-60e3d65023"

    let text_input = "2021"

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
    
    // ************* Once submitted, checking the next page's identifiers *************************
    let otp_enter_input = "input#telephoneinput-7e59f4f31d"
    let submit_btn_identifier = "button#button-410c1ebf4e"
    await page.waitForSelector(otp_enter_input);
    const otp_enter_input_field_name = await page.$eval(otp_enter_input, el=>el.getAttribute('name'));
    console.log('OTP Enter Input Name attribute:', otp_enter_input_field_name);
    await page.waitForSelector(submit_btn_identifier);
    const submit_btn_name = await page.$eval(submit_btn_identifier, el=>el.getAttribute('name'));
    console.log('Submit Button Name attribute:', submit_btn_name);

  });

});
