import {
  OTPVAL,
  RESENDOTP,
  getThisCard,
  prefillForm,
  createPanValidationRequest,
  getAddressDetails,
  pinCodeMaster,
  validateEmailID,
  currentAddressToggleHandler,
  finalDap,
  currentFormContext,
} from '../creditcards/corporate-creditcardFunctions.js';
import { urlPath, santizedFormData} from './formutils.js';
import { fetchJsonResponse, restAPICall } from './makeRestAPI.js';

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
  return fetchJsonResponse(path, jsonObj, 'POST');
}




/**
 * aadharInit
 * @param {object} mobileNumber
 * @param {object} pan
 * @param {object} dob
 * @param {object} globals - The global object containing necessary globals form data.
 * @return {PROMISE}
 */
function aadharInit(mobileNumber, pan, dob, globals) {
  debugger;
  const jsonObj = {
      requestString: {
        initParameters: {
          journeyId: currentFormContext.journeyID,
          transactionId: "",
          journeyName: "CORPORATE_CARD_JOURNEY",
          userAgent: window.navigator.userAgent,
          mobileNumber: mobileNumber.$value,
          leadProfileId: currentFormContext.leadProfile,
          additionalParam1: "",
          additionalParam2: "",
          identifierValue: pan.$value || dob.$value,
          identifierName: pan.$value ? 'PAN' : 'DOB',
        },
        auth: {
          journey_key: currentFormContext.journeyID,
          service_code: "XX2571ER"
        },
        existingCustomer: currentFormContext.journeyType,
        data_otp_gen: {
          UID_NO: ""
        },
        data_app: {
          journey_id: currentFormContext.journeyID,
          lead_profile_id: currentFormContext.leadProfile,
          callback: "/content/hdfc_etb_wo_pacc/api/aadharCallback.json",
          lead_profile: {
            leadProfileId: currentFormContext.leadProfile,
            mobileNumber: mobileNumber.$value,
            Addresses: ""
          },
          journeyStateInfo: {
            state: "CUSTOMER_AADHAR_VALIDATION",
            stateInfo: "CORPORATE_CARD_JOURNEY",
            formData: JSON.stringify(santizedFormData(globals))
          },
          auditData: {
            action: "CUSTOMER_AADHAR_VALIDATION",
            auditType: "Regulatory"
          },
          filler1: "filler1",
          filler2: "filler2",
          filler3: "filler3",
          filler4: "filler4",
          filler5: "filler5",
          filler6: "filler6",
          filler7: "filler7",
          filler8: "filler8",
          filler9: "filler9",
          filler10: "filler10"
        },
        client_info: {
          browser: {
            name: "Chrome",
            version: "124",
            majver: ""
          },
          cookie: {
            source: "AdobeForms",
            name: "NTBCC",
            ProductShortname: "IS"
          },
          "client_ip": "",
          device: {
            type: "desktop",
            name: "Samsung G5",
            os: "Windows",
            os_ver: "637.38383"
          },
          isp: {
            ip: "839.893.89.89",
            provider: "AirTel",
            city: "Mumbai",
            state: "Maharashrta",
            pincode: "400828"
          },
          geo: {
            lat: "72.8777° E",
            long: "19.0760° N"
          }
        }
      }
    };
  const path = urlPath('/content/hdfc_etb_wo_pacc/api/aadharInit.json');
  return fetchJsonResponse(path, jsonObj, 'POST');
}


/**
 * otp validation
 * @param {object} globals - The global object containing necessary globals form data.
 */
function otpValidation(globals) {
  const payload = OTPVAL.getPayload(globals);
  restAPICall(globals, 'POST', payload, OTPVAL.path, OTPVAL.successCallback, OTPVAL.errorCallback, OTPVAL.loadingText);
}

/**
 * check offer
 * @param {string} firstName - The first name of the cardholder.
 * @param {string} middleName - The last name of the cardholder.
 * @param {string} lastName - The last name of the cardholder.
 * @param {object} globals - The global object containing necessary globals form data.
 */
function checkOffer(firstName, middleName, lastName, globals) {
  createPanValidationRequest(firstName, middleName, lastName, globals);
}

/**
 * resend otp
 *
 * @param {object} globals - The global object containing necessary globals form data.
 */
function resendOTP(globals) {
  restAPICall(
    globals,
    'POST',
    RESENDOTP.getPayload(globals),
    RESENDOTP.path,
    RESENDOTP.successCallback,
    RESENDOTP.errorCallback,
    RESENDOTP.loadingText,
  );
}

export {
  getOTP,
  otpValidation,
  resendOTP,
  checkOffer,
  getThisCard,
  prefillForm,
  getAddressDetails,
  pinCodeMaster,
  validateEmailID,
  currentAddressToggleHandler,
  finalDap,
  aadharInit,
};
