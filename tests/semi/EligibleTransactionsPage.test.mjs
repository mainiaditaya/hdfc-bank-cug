/*

This file contains test cases for SEMI : Eligible Transactions Screen

--------------------------- Test Cases Covered -----------------------------
Before : 
      - Opening Pupeteers browser and a new page
Before Each : 
      - Page go to SEMI URL
      - Move to second page by entering test data and submitting
      - Move to Eligible transaction screen after entering OTP
After : 
      - Close Browser
After Each : 
      - Console log completion of test


1) Title Check test : 
      - Checking if the title on the WelcomePage is "Eligible Transactions"
2) Form render test : 
      - Checking if a selector named 'form' is present on page
3) Image Check : 
      - Checking if the Card Facia is visible
4) Image Alt Check : 
      - Checking if there is a Card Alt text 
5) Billed Transaction None Checked Test Case
      - Checking if the indicator shows 0 selected when none are selected
6) Billed Transaction Single Check Test Case
      - Checking whether the indicator updates to 1 when one checkbox is selected
7) Unbilled Transaction None Checked Test Case  
      - Checking if the indicator shows 0 selected when none are selected
8) Unbilled Transaction Select One Test Case
      - Checking whether the indicator updates to 1 when one checkbox is selected
9) Select Top 10 Test Case
      - Checking whether the Total transactions indicator changes to 10, when select top 10 button is clicked.
10) Total Transactions None Selected Test Case
      - Checking if the Total transactions indicator shows 0 when no checkbox is selected initially
11) Total Transactions Single Selected from Billed and Unbilled Test Case
      - Checking if the Total transaction updates to 2/10, when one transaction from billed and unbilled is selected.
12) Continue button Test Case : 
      - Still needs to be added.
*/


import { expect } from "chai";
import playwright from 'playwright';
import { titleCheck, textContentCheck, visibilityCheck, radioIsChecked, radioClickAndCheck, textFieldValidation, dateFieldValidation,checkboxClickAndCheck, buttonClick, checkPageContents } from '../utils/helperFunctions.mjs';

describe('Eligible Transactions Page Test', function() {
  let browser;
  let page;
  console.log("Beginning the tests")
  let url = "http://localhost:3000/content/forms/af/hdfc_haf/cards/semi/forms/semi";

  //--------------------------------Before and After Statements --------------------------------------------
  beforeEach(async function(){
    // Logic that runs before each test
    console.log("Running test....");
    page.goto(url);
    
    // ************************************ WELCOME PAGE ***********************************************
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

      
    // ************************************ OTP VALIDATION PAGE ***********************************************
    // --------------------------------- ENTER OTP ----------------------------------------
    let identifier_otp_field = "input#telephoneinput-7e59f4f31d"
    let text_input_otp = "123456"
    await page.click(identifier_otp_field);
    let otp_results = await textFieldValidation(page, identifier_otp_field, text_input_otp, text_input_otp, false, null, null)

    // ---------------------------------- SUBMIT OTP BTN -------------------------------------
    let submit_btn_identifier = "button#button-410c1ebf4e"
    await buttonClick(page, submit_btn_identifier);

  });

  // Set up the browser and page before running the tests
  before(async function() {
    browser = await playwright['chromium'].launch({headless:true});
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
  })


  //----------------------------------------- Test Cases -------------------------------------------------


//   ************* Title Check Test Case ******************
  it('Title Check', async function() {
    let next_identifier1 = "#text-708fa8a7ff p p"
    let result = await textContentCheck(page, next_identifier1, 'Eligible Transactions');
    await expect(result.inputEqual).to.include(true);
  });   

   // ************* Form Check Test Case ******************
   it('Form should render', async function(){
      await visibilityCheck(page, 'form');
    });

  // ************* Image Check Test Case ******************
  it('Card Facia Check', async function() {
    let imageSelector = "#panelcontainer-456e4dd868 div picture img"
    await visibilityCheck(page, imageSelector);
  });

    // ************* Image Alt Check Test Case ******************
  it('Card Facia Alt Check', async function() {
    let imageSelector = "#panelcontainer-456e4dd868 div picture img"
    await page.waitForSelector(imageSelector);
    // Check if the image with the specified alt text is present
    let alt = await page.$eval(imageSelector, el => el.getAttribute('alt'));
    console.log("Alt text : " , alt);
    await expect(alt).to.equals("aem_cardfacia");
   });

  // ************** Billed Transaction None Checked Test Case ****************
  it('Billed Transaction None Checked Test Case', async function(){
    let count = 0;

    let number_checked_identifier = "input#numberinput-73d62ce5af"
    const number_checkbox_selected = await page.$eval(number_checked_identifier, b => b.value)

    console.log("Number of checkbox selected as per page : " , number_checkbox_selected);
    console.log("Number of checkboxes actually selected : " , count);

    await expect(number_checkbox_selected).to.equal(count.toString());

   });  

   // ************** Billed Transaction Single Check Test Case ****************
   it('Billed Transaction Single Check Test Case', async function(){
    let checkbox_identifier = "#checkbox-3a51c813b1";
    await page.click(checkbox_identifier);
    let count = 1;

    // Select all checkboxes with the specified name
    // const checkboxes = await page.$$eval('input[name="aem_Txn_checkBox"]',  el => el.getAttribute('name'));

    // let count = 0;
    // for (const checkbox of checkboxes){
    //     console.log(checkbox)
    //     if(count == 10){
    //         break;
    //     }
    //     // await checkbox.click();
    //     count+=1;
    // }

    let number_checked_identifier = "input#numberinput-73d62ce5af"
    const number_checkbox_selected = await page.$eval(number_checked_identifier, b => b.value)

    console.log("Number of checkbox selected as per page : " , number_checkbox_selected);
    console.log("Number of checkboxes actually selected : " , count);

    await expect(number_checkbox_selected).to.equal(count.toString());

   });  

   // ************** Unbilled Transaction None Checked Test Case ****************
  it('Unbilled Transaction None Checked Test Case', async function(){
    let count = 0;
    
    let number_checked_identifier = "input#numberinput-6a0072dd86"
    const number_checkbox_selected = await page.$eval(number_checked_identifier, b => b.value)

    console.log("Number of checkbox selected as per page : " , number_checkbox_selected);
    console.log("Number of checkboxes actually selected : " , count);

    await expect(number_checkbox_selected).to.equal(count.toString());

   }); 

  // ************** Unbilled Transaction Select One Test Case ****************
  it('Unbilled Transaction Select One Test Case', async function(){
    let checkbox_identifier = "input#checkbox-00bcc7d97e";
    await page.click(checkbox_identifier);
    let count = 1;

    let number_checked_identifier = "input#numberinput-6a0072dd86"
    const number_checkbox_selected = await page.$eval(number_checked_identifier, b => b.value)

    console.log("Number of checkbox selected as per page : " , number_checkbox_selected);
    console.log("Number of checkboxes actually selected : " , count);

    await expect(number_checkbox_selected).to.equal(count.toString());

   }); 
   
   // ************** Select Top 10 Test Case ****************
  it('Select Top 10 Test Case', async function(){
    let select_top10_identifier = "button#button-bdaf4631db";
    await page.click(select_top10_identifier);
    let count = 10;

    let total_transactions_identifier = "div#text-ee92c8f2c8 p p"
    const total_transactions = await page.$eval(total_transactions_identifier, b => b.textContent)

    console.log(total_transactions);
    console.log("Number of checkboxes actually selected : " , count);

    await expect(total_transactions).to.equal(`Total selected ${count}/10`);

   });  
   

   // ************* Total Transactions None Selected Test Case *****************
   it('Total Transactions None Checked Test Case', async function(){
    let count = 0;

    let total_transactions_identifier = "div#text-ee92c8f2c8 p p"
    const total_transactions = await page.$eval(total_transactions_identifier, b => b.textContent)

    console.log(total_transactions);
    console.log("Number of checkboxes actually selected : " , count);

    await expect(total_transactions).to.equal(`Total selected ${count}/10`);

   }); 

   // ************* Total Transactions Single Selected from Billed and Unbilled Test Case *****************
   it('Total Transactions Single Selected from Billed and Unbilled Test Case', async function(){

    let checkbox_identifier = "#checkbox-3a51c813b1";
    await page.click(checkbox_identifier);

    let checkbox_identifier1 = "input#checkbox-00bcc7d97e";
    await page.click(checkbox_identifier1);

    let count = 2;

    let total_transactions_identifier = "div#text-ee92c8f2c8 p p"
    const total_transactions = await page.$eval(total_transactions_identifier, b => b.textContent)

    console.log(total_transactions);
    console.log("Number of checkboxes actually selected : " , count);

    await expect(total_transactions).to.equal(`Total selected ${count}/10`);

   }); 

});
