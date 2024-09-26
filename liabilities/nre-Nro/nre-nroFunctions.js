/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import {
  createJourneyId,
} from './nre-nro-journey-utils.js';
import {
  ageValidator,
  clearString,
  urlPath,
} from '../../common/formutils.js';
import {
  displayLoader,
  hideLoaderGif,
  fetchJsonResponse,
} from '../../common/makeRestAPI.js';
import * as CONSTANT from '../../common/constants.js';
import { initAdaptiveForm } from '../../blocks/form/rules/index.js';

var prevSelectedIndex = -1;
const resendOtpCount = 0;
const MAX_OTP_RESEND_COUNT = 3;
const OTP_TIMER = 30;
let sec = OTP_TIMER;
let dispSec = OTP_TIMER;
const {
  ENDPOINTS,
  CURRENT_FORM_CONTEXT: currentFormContext,
  FORM_RUNTIME: formRuntime,
  CHANNEL,
} = CONSTANT;
// Initialize all Corporate Card Journey Context Variables.
currentFormContext.journeyType = 'NTB';
currentFormContext.errorCode = '';
currentFormContext.errorMessage = '';
currentFormContext.eligibleOffers = '';

formRuntime.getOtpLoader = currentFormContext.getOtpLoader || (typeof window !== 'undefined') ? displayLoader : false;
formRuntime.otpValLoader = currentFormContext.otpValLoader || (typeof window !== 'undefined') ? displayLoader : false;
formRuntime.hideLoader = (typeof window !== 'undefined') ? hideLoaderGif : false;

/**
 * Validates the date of birth field to ensure the age is between 18 and 120.
 * @param {Object} globals - The global object containing necessary data for DAP request.
*/

const validateLogin = (globals) => {
  const mobileNo = globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.mobilePanel.registeredMobileNumber.$value;
  const isdCode = globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.mobilePanel.countryCode.$value;
  const dobValue = globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.dateOfBirth.$value;
  const panValue = globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.pan.$value;
  const panDobSelection = globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.panDobSelection.$value;
  const radioSelect = (panDobSelection === '0') ? 'DOB' : 'PAN';
  const regexPan = /^[a-zA-Z]{3}[Pp][a-zA-Z][0-9]{4}[a-zA-Z]{1}/g;
  const consentFirst = globals.form.parentLandingPagePanel.landingPanel.consentsFragmentNreNro.checkboxConsent1Label.$value;
  const panErrorText = 'Please enter a valid PAN Number';
  const isdNumberPattern = /^(?!0)([5-9]\d{9})$/;
  const nonISDNumberPattern = /^(?!0)\d{3,15}$/;
  globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: false });

  const panInput = document.querySelector(`[name=${'pan'} ]`);
  const panWrapper = panInput.parentElement;

  switch (radioSelect) {
    case 'DOB':
      if (dobValue && String(new Date(dobValue).getFullYear()).length === 4) {
        const minAge = 18;
        const maxAge = 120;
        const dobErrorText = `Age should be between ${minAge} to ${maxAge}`;
        const ageValid = ageValidator(minAge, maxAge, dobValue);
        if (ageValid && consentFirst) {
          globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: true });
          globals.functions.markFieldAsInvalid('$form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.dateOfBirth', '', { useQualifiedName: true });
        }
        if (ageValid) {
          globals.functions.markFieldAsInvalid('$form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.dateOfBirth', '', { useQualifiedName: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.dateOfBirth, { valid: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.dobErrorText, { visible: false });
        }
        if (!ageValid) {
          globals.functions.markFieldAsInvalid('$form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.dateOfBirth', dobErrorText, { useQualifiedName: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.dobErrorText, { visible: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: false });
        }
        if (!consentFirst) {
          globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: false });
        }
      }
      break;
    case 'PAN':
      panWrapper.setAttribute('data-empty', true);
      if (panValue) {
        panWrapper.setAttribute('data-empty', false);
        const validPan = regexPan.test(panValue);
        if (validPan && consentFirst) {
          globals.functions.markFieldAsInvalid('$form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.pan', '', { useQualifiedName: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: true });
        }
        if (validPan) {
          globals.functions.markFieldAsInvalid('$form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.pan', '', { useQualifiedName: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.pan, { valid: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.panErrorText, { visible: false });
        }
        if (!validPan) {
          globals.functions.markFieldAsInvalid('$form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.pan', panErrorText, { useQualifiedName: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.identifierPanel.panErrorText, { visible: true });
          globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: false });
        }
        if (!consentFirst) {
          globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: false });
        }
      }
      break;
    default:
      globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: false });
  }
  if (mobileNo && ((isdCode === '91' && !isdNumberPattern.test(mobileNo))
    || (isdCode !== '91' && !nonISDNumberPattern.test(mobileNo)))) {
    globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.mobilePanel.registerMobileNumberError, { visible: true });
    globals.functions.setProperty(globals.form.parentLandingPagePanel.getOTPbutton, { enabled: false });
  } else {
    globals.functions.setProperty(globals.form.parentLandingPagePanel.landingPanel.loginFragmentNreNro.mobilePanel.registerMobileNumberError, { visible: false });
  }
};

const getOtpNRE = (mobileNumber, pan, dob, globals) => {
  /* jidTemporary  temporarily added for FD development it has to be removed completely once runtime create journey id is done with FD */
  const jidTemporary = createJourneyId('online', globals.form.runtime.journeyName.$value, CHANNEL, globals);
  currentFormContext.action = 'getOTP';
  currentFormContext.journeyID = globals.form.runtime.journeyId.$value || jidTemporary;
  currentFormContext.leadIdParam = globals.functions.exportData().queryParams;
  const jsonObj = {
    requestString: {
      mobileNumber: mobileNumber.$value,
      dateOfBirth: clearString(dob.$value) || '',
      panNumber: pan.$value || '',
      journeyID: globals.form.runtime.journeyId.$value ?? jidTemporary,
      journeyName: globals.form.runtime.journeyName.$value || currentFormContext.journeyName,
      identifierValue: pan.$value || clearString(dob.$value),
      identifierName: pan.$value ? 'PAN' : 'DOB',
    },
  };
  const path = urlPath(ENDPOINTS.customerOtpGen);
  formRuntime?.getOtpLoader();
  return fetchJsonResponse(path, jsonObj, 'POST', true);
};

const getCountryCodes = (dropdown) => {
  console.log("Beginning GetCountryCode");
  var finalURL = "/content/hdfc_commonforms/api/mdm.ETB.NRI_ISD_MASTER.COUNTRYNAME-.json";
  console.log("URL : ", finalURL);
  
  fetchJsonResponse(urlPath(finalURL), null, 'GET', true).then(response => {
    console.log('Promise resolved:'); // Handle the resolved value (success case)

    // Dropdown eventlistener : 
    // Add an event listener to detect when an option is selected
    dropdown.addEventListener('change', function() {
      if(prevSelectedIndex != -1){
        console.log(dropdown.options);
        dropdown.remove(prevSelectedIndex);
        console.log(dropdown.options);
      }
      const selectedIndex = dropdown.selectedIndex;
      const selectedOption = dropdown.options[selectedIndex];
      const selectedOptionText = selectedOption.text;
      const selectedOptionVal = selectedOption.value;
      const newOption = document.createElement('option');
      newOption.value = selectedOptionVal;
      newOption.text = selectedOptionText;
      dropdown.options[selectedIndex].text = selectedOptionVal;
      dropdown.options[selectedIndex].style.display = 'none';
      dropdown.add(newOption, selectedIndex+1);
      prevSelectedIndex = selectedIndex;
    });

      dropdown.innerHTML = '';
      response.forEach(countryCode => {
        if(countryCode.ISDCODE != null && countryCode.DESCRIPTION != null){    
            const val =  " (+" + countryCode.ISDCODE + ")";
            const key = countryCode.DESCRIPTION + val;
            const newOption = document.createElement('option');
            newOption.value = val;
            newOption.textContent = key;
            dropdown.appendChild(newOption);
          }
      });
      dropdown.selectedIndex = 36;
      const event = new Event('change', {
        bubbles: true, // Allow the event to bubble up
        cancelable: true // Allow the event to be canceled
      });
      dropdown.dispatchEvent(event);

    // });
  }).catch(error => {
    console.error('Promise rejected:', error);  // Handle any error (failure case)
  });
  
};

/**
 * Starts the Nre_Nro OTPtimer for resending OTP.
 * @param {Object} globals - The global object containing necessary data for DAP request.
*/
function otpTimer(globals) {
  if (resendOtpCount < MAX_OTP_RESEND_COUNT) {
    globals.functions.setProperty(globals.form.otpPanel.otpFragment.otpPanel.secondsPanel, { visible: true });
    globals.functions.setProperty(globals.form.otpPanel.otpFragment.otpPanel.otpResend, { visible: false });
  } else {
    globals.functions.setProperty(globals.form.otpPanel.otpFragment.otpPanel.secondsPanel, { visible: false });
  }
  const timer = setInterval(() => {
    globals.functions.setProperty(globals.form.otpPanel.otpFragment.otpPanel.secondsPanel.seconds, { value: dispSec });
    sec -= 1;
    dispSec = sec;
    if (sec < 10) {
      dispSec = `0${dispSec}`;
    }
    if (sec < 0) {
      clearInterval(timer);
      globals.functions.setProperty(globals.form.otpPanel.otpFragment.otpPanel.secondsPanel, { visible: false });
      if (resendOtpCount < MAX_OTP_RESEND_COUNT) globals.functions.setProperty(globals.form.otpPanel.otpFragment.otpPanel.otpResend, { visible: true });
    }
  }, 1000);
}

setTimeout( async () =>  {
  console.log("Calling getCountryCodes function");
  await getCountryCodes(document.querySelector('.field-countrycode select'));
}, 2000);

export {
  createJourneyId,
  validateLogin,
  getOtpNRE,
  otpTimer,
  getCountryCodes,
};
