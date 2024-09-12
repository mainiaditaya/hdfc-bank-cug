/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import {
  createJourneyId,
} from './nre-nro-journey-utils.js';
import {
  ageValidator,
} from '../../common/formutils.js';
import {
  displayLoader, hideLoaderGif,
} from '../../common/makeRestAPI.js';
import * as CONSTANT from '../../common/constants.js';

const {
  CURRENT_FORM_CONTEXT: currentFormContext,
  FORM_RUNTIME: formRuntime,
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
 * Validates the date of birth field to ensure the age is between 18 and 70.
 * @param {Object} globals - The global object containing necessary data for DAP request.
*/

const validateLogin = (globals) => {
  const mobileNo = globals.form.nre_nro_loginPanel.mobilePanel.registeredMobileNumber.$value;
  const isdCode = globals.form.nre_nro_loginPanel.mobilePanel.countryCode.$value;
  const { $value } = globals.form.nre_nro_loginPanel.identifierPanel.dateOfBirth;
  const dobValue = globals.form.nre_nro_loginPanel.identifierPanel.dateOfBirth.$value;
  const panValue = globals.form.nre_nro_loginPanel.identifierPanel.pan.$value;
  const panDobSelection = globals.form.nre_nro_loginPanel.identifierPanel.panDobSelection.$value;
  const radioSelect = (panDobSelection === '0') ? 'DOB' : 'PAN';
  const regexPan = /^[a-zA-Z]{3}[Pp][a-zA-Z][0-9]{4}[a-zA-Z]{1}/g;
  const consentFirst = globals.form.Terms_Conditions.checkboxConsent1Label.$value;
  const panErrorText = 'Please enter a valid PAN Number';
  const isdNumberPattern = /^(?!0)([5-9]\d{9})$/;
  const nonISDNumberPattern = /^(?!0)\d{3,15}$/;
  globals.functions.setProperty(globals.form.getOTPbutton, { enabled: false });

  const panInput = document.querySelector(`[name=${'pan'} ]`);
  const panWrapper = panInput.parentElement;
  if ((isdCode === '91' && !isdNumberPattern.test(mobileNo))
    || (isdCode !== '91' && !nonISDNumberPattern.test(mobileNo))) {
    globals.functions.setProperty(globals.form.nre_nro_loginPanel.mobilePanel.registerMobileNumberError, { visible: true });
    globals.functions.setProperty(globals.form.getOTPbutton, { enabled: true });
  } else {
    globals.functions.setProperty(globals.form.nre_nro_loginPanel.mobilePanel.registerMobileNumberError, { visible: false });
  }
  switch (radioSelect) {
    case 'DOB':
      if (dobValue && String(new Date(dobValue).getFullYear()).length === 4) {
        const minAge = 18;
        const maxAge = 120;
        const dobErrorText = `Age should be between ${minAge} to ${maxAge}`;
        const ageValid = ageValidator(minAge, maxAge, $value);
        if (ageValid && consentFirst) {
          globals.functions.setProperty(globals.form.getOTPbutton, { enabled: true });
          globals.functions.markFieldAsInvalid('$form.nre_nro_loginPanel.identifierPanel.dateOfBirth', '', { useQualifiedName: true });
        }
        if (ageValid) {
          globals.functions.markFieldAsInvalid('$form.nre_nro_loginPanel.identifierPanel.dateOfBirth', '', { useQualifiedName: true });
          globals.functions.setProperty(globals.form.nre_nro_loginPanel.identifierPanel.dateOfBirth, { valid: true });
        }
        if (!ageValid) {
          globals.functions.markFieldAsInvalid('$form.nre_nro_loginPanel.identifierPanel.dateOfBirth', dobErrorText, { useQualifiedName: true });
          globals.functions.setProperty(globals.form.getOTPbutton, { enabled: false });
        }
        if (!consentFirst) {
          globals.functions.setProperty(globals.form.getOTPbutton, { enabled: false });
        }
      }
      break;
    case 'PAN':
      panWrapper.setAttribute('data-empty', true);
      if (panValue) {
        panWrapper.setAttribute('data-empty', false);
        const validPan = regexPan.test(panValue);
        if (validPan && consentFirst) {
          globals.functions.markFieldAsInvalid('$form.nre_nro_loginPanel.identifierPanel.pan', '', { useQualifiedName: true });
          globals.functions.setProperty(globals.form.getOTPbutton, { enabled: true });
        }
        if (validPan) {
          globals.functions.markFieldAsInvalid('$form.nre_nro_loginPanel.identifierPanel.pan', '', { useQualifiedName: true });
          globals.functions.setProperty(globals.form.nre_nro_loginPanel.identifierPanel.pan, { valid: true });
        }
        if (!validPan) {
          globals.functions.markFieldAsInvalid('$form.nre_nro_loginPanel.identifierPanel.pan', panErrorText, { useQualifiedName: true });
          globals.functions.setProperty(globals.form.getOTPbutton, { enabled: false });
        }
        if (!consentFirst) {
          globals.functions.setProperty(globals.form.getOTPbutton, { enabled: false });
        }
      }
      break;
    default:
      globals.functions.setProperty(globals.form.getOTPbutton, { enabled: false });
  }
};

export {
  createJourneyId,
  validateLogin,
};
