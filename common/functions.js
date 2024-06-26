/* eslint-disable no-console */
import {
  getThisCard,
  prefillForm,
  getAddressDetails,
  pinCodeMaster,
  validateEmailID,
  currentAddressToggleHandler,
  corpCreditCardContext,
  otpValHandler,
  journeyResponseHandler,
  createJourneyId,
  sendAnalytics,
  aadharConsent123,
  resendOTP,
  formRuntime,
  executeInterfaceApi,
  executeInterfaceApiFinal,
  executeInterfacePostRedirect,
  executeInterfaceResponseHandler,
  ipaRequestApi,
  ipaSuccessHandler,
  documentUpload,
  checkMode,
  customSetFocus,
} from '../creditcards/corporate-creditcardFunctions.js';

import {
  validatePan,
  panAPISuccesHandler,
} from './panvalidation.js';

import fetchAuthCode from './idcomutil.js';

import {
  urlPath, santizedFormDataWithContext, getTimeStamp, clearString,
} from './formutils.js';

import {
  fetchJsonResponse, hideLoaderGif,
} from './makeRestAPI.js';

import * as CONSTANT from './constants.js';
import * as CC_CONSTANT from '../creditcards/constant.js';

const { ENDPOINTS } = CONSTANT;
const { JOURNEY_NAME } = CC_CONSTANT;
const { currentFormContext } = corpCreditCardContext;

// dynamically we can change according to journey
const journeyNameConstant = JOURNEY_NAME;

/**
 * generates the otp
 * @param {object} mobileNumber
 * @param {object} pan
 * @param {object} dob
 * @param {object} globals
 * @return {PROMISE}
 */
function getOTP(mobileNumber, pan, dob, globals) {
  currentFormContext.action = 'getOTP';
  currentFormContext.journeyID = globals.form.runtime.journeyId.$value;
  console.log(currentFormContext);
  // currentFormContext.leadProfile = {};
  const jsonObj = {
    requestString: {
      mobileNumber: mobileNumber.$value,
      dateOfBith: dob.$value || '',
      panNumber: pan.$value || '',
      journeyID: globals.form.runtime.journeyId.$value,
      journeyName: journeyNameConstant,
      userAgent: window.navigator.userAgent,
      identifierValue: pan.$value || dob.$value,
      identifierName: pan.$value ? 'PAN' : 'DOB',
    },
  };
  const path = urlPath(ENDPOINTS.otpGen);
  formRuntime?.getOtpLoader();
  return fetchJsonResponse(path, jsonObj, 'POST', true);
}

/**
 * validates the otp
 * @param {object} mobileNumber
 * @param {object} pan
 * @param {object} dob
 * @return {PROMISE}
 */
function otpValidation(mobileNumber, pan, dob, otpNumber) {
  const referenceNumber = `AD${getTimeStamp(new Date())}` ?? '';
  currentFormContext.referenceNumber = referenceNumber;
  const jsonObj = {
    requestString: {
      mobileNumber: mobileNumber.$value,
      passwordValue: otpNumber.$value,
      dateOfBirth: clearString(dob.$value) || '',
      panNumber: pan.$value || '',
      channelSource: '',
      journeyID: currentFormContext.journeyID,
      journeyName: journeyNameConstant,
      dedupeFlag: 'N',
      userAgent: window.navigator.userAgent,
      referenceNumber: referenceNumber ?? '',
    },
  };
  const path = urlPath(ENDPOINTS.otpValFetchAssetDemog);
  formRuntime?.otpValLoader();
  return fetchJsonResponse(path, jsonObj, 'POST', true);
}

function getOS() {
  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

function getDevice() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowser() {
  const ua = navigator.userAgent; let tem; let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: (tem[1] || '') };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) { return { name: 'Opera', version: tem[1] }; }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  // eslint-disable-next-line no-cond-assign
  if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
  return {
    name: M[0],
    version: M[1],
    majver: '',
  };
}

function updateFormElement(form, key, value) {
  const field = document.createElement('input');
  field.setAttribute('type', 'hidden');
  field.setAttribute('name', key);
  field.setAttribute('value', value);
  form.appendChild(field);
}

/**
 * aadharInit
 * @param {object} mobileNumber
 * @param {object} pan
 * @param {object} dob
 * @param {object} globals - The global object containing necessary globals form data.
 * @return {PROMISE}
 */
async function aadharInit(mobileNumber, pan, dob, globals) {
  currentFormContext.VISIT_TYPE = 'AADHAR';
  const jsonObj = {
    requestString: {
      initParameters: {
        journeyId: currentFormContext.journeyID,
        transactionId: currentFormContext.journeyID.replace(/-/g, '').replace(/_/g, ''),
        journeyName: journeyNameConstant,
        userAgent: window.navigator.userAgent,
        mobileNumber: mobileNumber.$value,
        leadProfileId: globals?.form.runtime.leadProifileId.$value,
        additionalParam1: '',
        additionalParam2: '',
        identifierValue: pan.$value || dob.$value,
        identifierName: pan.$value ? 'PAN' : 'DOB',
      },
      auth: {
        journey_key: currentFormContext.journeyID,
        service_code: 'XX2571ER',
      },
      existingCustomer: currentFormContext.journeyType === 'NTB' ? 'N' : 'Y',
      data_otp_gen: {
        UID_NO: '',
      },
      data_app: {
        journey_id: currentFormContext.journeyID,
        lead_profile_id: globals?.form.runtime.leadProifileId.$value,
        callback: urlPath(ENDPOINTS.aadharCallback),
        lead_profile: {
          leadProfileId: globals?.form.runtime.leadProifileId.$value,
          mobileNumber: mobileNumber.$value,
          Addresses: '',
        },
        journeyStateInfo: {
          state: 'CUSTOMER_AADHAR_VALIDATION',
          stateInfo: journeyNameConstant,
          formData: santizedFormDataWithContext(globals, currentFormContext),
        },
        auditData: {
          action: 'CUSTOMER_AADHAR_VALIDATION',
          auditType: 'Regulatory',
        },
        filler1: 'filler1',
        filler2: 'filler2',
        filler3: 'filler3',
        filler4: 'filler4',
        filler5: 'filler5',
        filler6: 'filler6',
        filler7: 'filler7',
        filler8: 'filler8',
        filler9: 'filler9',
        filler10: 'filler10',
      },
      client_info: {
        browser: getBrowser(),
        cookie: {
          source: 'AdobeForms',
          name: 'NTBCC',
          ProductShortname: 'IS',
        },
        client_ip: '',
        device: {
          type: getDevice(),
          name: 'Samsung G5',
          os: getOS(),
          os_ver: '637.38383',
        },
        isp: {
          ip: '839.893.89.89',
          provider: 'AirTel',
          city: 'Mumbai',
          state: 'Maharashrta',
          pincode: '400828',
        },
        geo: {
          lat: '72.8777° E',
          long: '19.0760° N',
        },
      },
    },
  };

  const path = urlPath(ENDPOINTS.aadharInit);
  const response = fetchJsonResponse(path, jsonObj, 'POST');
  response
    .then((res) => {
      console.log(res);
      // var aadharValidationForm = "<form action=" + res.RedirectUrl + " method='post'></form>";
      const aadharValidationForm = document.createElement('form');
      aadharValidationForm.setAttribute('action', res.RedirectUrl);
      aadharValidationForm.setAttribute('method', 'POST');
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const key in res) {
        updateFormElement(aadharValidationForm, key, res[key]);
      }
      document.querySelector('body').append(aadharValidationForm);
      // aadharValidationForm.appendTo('body');
      aadharValidationForm.submit();
    }).catch((err) => console.log(err));
}

/**
 * Redirects the browser to the specified URL.
 *
 * @name redirect
 * @param {string} redirectUrl - The URL to redirect the browser to.
 */
function redirect(redirectUrl) {
  window.location.href = redirectUrl;
}

export {
  getOTP,
  otpValidation,
  getThisCard,
  prefillForm,
  getAddressDetails,
  pinCodeMaster,
  validateEmailID,
  currentAddressToggleHandler,
  aadharInit,
  checkMode,
  otpValHandler,
  customSetFocus,
  journeyResponseHandler,
  corpCreditCardContext,
  createJourneyId,
  validatePan,
  panAPISuccesHandler,
  executeInterfaceApi,
  ipaRequestApi,
  ipaSuccessHandler,
  sendAnalytics,
  aadharConsent123,
  resendOTP,
  fetchAuthCode,
  redirect,
  hideLoaderGif,
  executeInterfacePostRedirect,
  executeInterfaceApiFinal,
  executeInterfaceResponseHandler,
  documentUpload,
};
