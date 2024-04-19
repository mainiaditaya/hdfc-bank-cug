import {
  OTPVAL, RESENDOTP, CHECKOFFER, getThisCard, prefillForm, getAddressDetails, currentFormContext,
} from '../creditcards/corporate-creditcardFunctions.js';

import { restAPICall, getJsonResponse } from './makeRestAPI.js';
import { urlPath } from './formutils.js';
/**
 * generates the otp
 * @param {object} mobileNumber
 * @param {object} pan
 * @param {object} dob
 * @return {PROMISE}
 */
function getOTP(mobileNumber, pan, dob) {
  const jsonObj = {
    requestString: {
      mobileNumber: mobileNumber.$value,
      dateOfBith: dob.$value || '',
      panNumber: pan.$value || '',
      journeyID: currentFormContext.journeyID,
      journeyName: currentFormContext.journeyName,
      userAgent: window.navigator.userAgent,
      identifierValue: pan.$value || dob.$value,
      identifierName: pan.$value ? 'PAN' : 'DOB',
    },
  };

  const path = urlPath('/content/hdfc_ccforms/api/customeridentificationV4.json');
  return getJsonResponse(path, jsonObj, 'POST');
}
/**
 * otp validation
 *
 * @param {object} globals - The global object containing necessary globals form data.
 */
function otpValidation(globals) {
  const payload = OTPVAL.getPayload(globals);
  restAPICall(globals, 'POST', payload, OTPVAL.path, OTPVAL.successCallback, OTPVAL.errorCallback, OTPVAL.loadingText);
}

/**
 * check offer
 *
 * @param {object} globals - The global object containing necessary globals form data.
 */
function checkOffer(globals) {
  restAPICall(globals, 'POST', CHECKOFFER.getPayload(globals), CHECKOFFER.path, CHECKOFFER.successCallback, CHECKOFFER.errorCallback, CHECKOFFER.loadingText);
}

/**
 * resend otp
 *
 * @param {object} globals - The global object containing necessary globals form data.
 */
function resendOTP(globals) {
  restAPICall(globals, 'POST', RESENDOTP.getPayload(globals), RESENDOTP.path, RESENDOTP.successCallback, RESENDOTP.errorCallback, RESENDOTP.loadingText);
}

export {
  getOTP, otpValidation, resendOTP, checkOffer, getThisCard, prefillForm, getAddressDetails,
};
