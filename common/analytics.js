/* eslint-disable no-undef */
import {
  data,
  ANALYTICS_CLICK_OBJECT,
  ANALYTICS_PAGE_LOAD_OBJECT,
} from './analyticsConstants.js';
import {
  createDeepCopyFromBlueprint,
  santizedFormDataWithContext,
} from './formutils.js';
import corpCreditCard from './constants.js';
import { corpCreditCardContext } from './journey-utils.js';

const { currentFormContext } = corpCreditCardContext;

/**
 * set analytics generic props for page load
 * @name setAnalyticPageLoadProps
 * @param {string} linkName - linkName
 * @param {string} linkType - linkName
 * @param {object} formContext - currentFormContext.
 * @param {object} digitalData
 */

function setAnalyticPageLoadProps(journeyState, formData, digitalDataEvent) {
  digitalDataEvent.page.pageInfo.pageName = 'Identify Yourself';
  digitalDataEvent.user.pseudoID = '';// Need to check
  digitalDataEvent.user.journeyName = currentFormContext?.journeyName;
  digitalDataEvent.user.journeyID = currentFormContext?.journeyID;
  digitalDataEvent.user.journeyState = journeyState;
  digitalDataEvent.user.casa = '';
  digitalDataEvent.form.name = corpCreditCard.formName;
}

/**
 * set analytics generic props for click event
 * @name setAnalyticClickGenericProps
 * @param {string} linkName - linkName
 * @param {string} linkType - linkName
 * @param {object} formContext - currentFormContext.
 * @param {object} digitalData
 */

function setAnalyticClickGenericProps(linkName, linkType, formData, journeyState, digitalDataEvent) {
  digitalDataEvent.link = {
    linkName,
    linkType,
  };
  digitalDataEvent.page.pageInfo.pageName = '';
  digitalDataEvent.link.linkPosition = '';
  digitalDataEvent.user.pseudoID = '';
  digitalDataEvent.user.journeyName = currentFormContext?.journeyName;
  digitalDataEvent.user.journeyID = currentFormContext?.journeyID;
  digitalDataEvent.user.journeyState = journeyState;
  if (linkName === 'otp click') {
    digitalDataEvent.form.name = corpCreditCard.formName;
    digitalDataEvent.user.casa = '';
  } else {
    digitalDataEvent.form.name = formData.etbFlowSelected === 'on' ? `${corpCreditCard.formName}-ETB` : `${corpCreditCard.formName}-NTB`;
    digitalDataEvent.user.casa = formData.etbFlowSelected === 'on' ? 'Yes' : 'No';
  }
  // window.digitalData = digitalDataEvent || {};
}

const getValidationMethod = (formContext) => {
  if (formContext && formContext?.login && formContext.login.panDobSelection) {
    return formContext.login.panDobSelection === '0' ? 'DOB' : 'PAN';
  }
  return '';
};

/**
 * Sends analytics event on page load.
 * @name sendPageloadEvent
 * @param {string} journeyState.
 * @param {object} formData.
 */
function sendPageloadEvent(journeyState, globals) {
  const digitalDataPageLoad = createDeepCopyFromBlueprint(ANALYTICS_PAGE_LOAD_OBJECT);
  const formData = santizedFormDataWithContext(globals);
  setAnalyticPageLoadProps(journeyState, formData, digitalDataPageLoad);
  switch (currentFormContext.action) {
    case 'check offers': {
      digitalDataPageLoad.card.selectedCard = '';
      digitalDataPageLoad.card.eligibleCard = '';
      break;
    }
    case 'confirmation': {
      // ((mobileValid === 'n')&&aadhaar_otp_val_data?.result?.mobileValid)
      // applRefNumber or referenceNumber
      digitalDataPageLoad.formDetails.reference = formData.currentFormContext.applRefNumber;
      digitalData.formDetails.isVideoKYC = 'yes'; // value - ? 'yes' or 'no' if aadhar and then applicationMismatch
      break;
    }
    default:
      // do nothing
  }
  // if (window) {
  //   window.digitalData = digitalDataPageLoad || {};
  // }
  _satellite.track('pageload');
}

/**
 *Creates digital data for otp click event.
 * @param {string} phone
 * @param {string} validationType
 * @param {string} eventType
 * @param {object} formContext
 * @param {object} digitalData
 */
function sendSubmitClickEvent(phone, eventType, linkType, formData, journeyState, digitalDataEvent) {
  setAnalyticClickGenericProps(eventType, linkType, formData, journeyState, digitalDataEvent);
  switch (eventType) {
    case 'otp click': {
      digitalDataEvent.event = {
        phone,
        validationMethod: getValidationMethod(formData),
      };
      _satellite.track('submit');
      break;
    }
    case 'check offers': {
      digitalDataEvent.user.gender = formData.form.gender;
      digitalDataEvent.user.email = formData.form.workEmailAddress;
      if (formData.form.currentAddressToggle === 'off') {
        digitalDataEvent.formDetails = {
          pincode: currentFormContext.breDemogResponse.VDCUSTZIPCODE,
          city: currentFormContext.breDemogResponse.VDCUSTCITY,
          state: currentFormContext.breDemogResponse.VDCUSTSTATE,
        };
      } else {
        const isETB = currentFormContext.journeyType === 'ETB';
        digitalDataEvent.formDetails = {
          pincode: isETB ? formData.form.newCurentAddressPin : formData.form.currentAddresPincodeNTB,
          city: isETB ? 'hardcodedETBCity' : 'hardcodedNTBCity',
          state: isETB ? 'hardcodedETBState' : 'hardcodedNTBState',
        };
      }
      Object.assign(digitalDataEvent.formDetails, {
        employmentType: formData.form.employmentType,
        companyName: formData.form.companyName,
        designation: formData.form.designation,
        relationshipNumber: formData.form.relationshipNumber,
      });
      currentFormContext.action = 'check offers';
      _satellite.track('submit');
      setTimeout(() => {
        sendPageloadEvent('CUSTOMER_BUREAU_OFFER_AVAILABLE', formData);
      }, 1000);
      break;
    }

    case 'get this card': {
      digitalDataEvent.card = {
        selectedCard: formData.form.productCode,
        annualFee: formData.form.joiningandRenewalFee,
      };
      // digitalDataEvent.event = {
      //   status: formData.cardBenefitsAgreeCheckbox,
      // };
      currentFormContext.action = 'confirmation';
      _satellite.track('submit');
      break;
    }

    case 'address continue': {
      digitalDataEvent.event = {
        status: formData?.form?.cardDeliveryAddressOption1 || formData?.form?.cardDeliveryAddressOption2,
        validationMethod: '', // Netbanking or Debit card - validationMethod - authmode will be getting only after idcom redirected - how to use that value
      };
      _satellite.track('submit');
      break;
    }

    case 'kyc continue': {
      const kyc = (formData?.form?.aadharEKYCVerification && 'Ekyc') || (formData?.form?.aadharBiometricVerification && 'Biometric') || (formData?.form?.officiallyValidDocumentsMethod && 'Other Docs');
      digitalDataEvent.formDetails = {
        KYCVerificationMethod: kyc,
      };
      _satellite.track('submit');
      break;
    }

    case 'i agree': {
      digitalDataEvent.formDetails = {
        languageSelected: currentFormContext?.languageSelected,
      };
      _satellite.track('submit');
      break;
    }

    case 'aadhaar otp': {
      // UID OR VID  how to capture the value - aadhar in different portal.
      digitalDataEvent.event = {
        status: '',
      };
      _satellite.track('submit');
      break;
    }

    case 'document upload continue': {
      digitalDataEvent.formDetails = {
        documentProof: formData?.docUploadDropdown, // documentType
      };
      _satellite.track('submit');
      break;
    }

    case 'start kyc': {
      // ETB_ Capture clicks on Start vKYC CTA, Applicable only for ETB Address Change, Only in case of Aadhaar and Application no. mismatch
      // NTB_ '1'(default without any condition)
      digitalDataEvent.event = {
        status: '1', // formData?.vkycProceedButton, //  value is '1' or '0' for -e63 capture
      };
      _satellite.track('submit');
      break;
    }

    case 'submit review': {
      // common both ntb + etb
      digitalDataEvent.event = {
        rating: formData?.ratingvalue,
      };
      _satellite.track('survey');
      break;
    }
    default:
      // do nothing
  }
  // window.digitalData = digitalDataEvent || {};
}

function populateResponse(payload, eventType, digitalDataEvent) {
  switch (eventType) {
    case 'otp click': {
      digitalDataEvent.page.pageInfo.errorCode = payload?.status?.errorCode;
      digitalDataEvent.page.pageInfo.errorMessage = payload?.status?.errorMessage;
      break;
    }
    case 'check offers':
    case 'i agree':
    case 'document upload continue':
    case 'get this card': {
      digitalDataEvent.page.pageInfo.errorCode = payload?.errorCode;
      digitalDataEvent.page.pageInfo.errorMessage = payload?.errorMessage;
      break;
    }
    default:
    // do nothing
  }
}

/**
 * Send analytics events.
 * @param {string} eventType
 * @param {object} payload
 * @param {string} journeyState
 * @param {object} formData
 * @param {object} currentFormContext
 */
function sendAnalyticsEvent(eventType, payload, journeyState, formData) {
  const digitalDataEvent = createDeepCopyFromBlueprint(ANALYTICS_CLICK_OBJECT);
  const attributes = data[eventType];
  populateResponse(payload, eventType, digitalDataEvent);
  sendSubmitClickEvent(formData?.login?.registeredMobileNumber, eventType, attributes?.linkType, formData, journeyState, digitalDataEvent);
}

/**
* sendErrorAnalytics
* @param {string} errorCode
* @param {string} errorMsg
* @param {string} journeyState
* @param {object} globals
*/
function sendErrorAnalytics(errorCode, errorMsg, journeyState, globals) {
  const digitalDataPageLoad = createDeepCopyFromBlueprint(ANALYTICS_PAGE_LOAD_OBJECT);
  setAnalyticPageLoadProps(journeyState, santizedFormDataWithContext(globals), digitalDataPageLoad);
  digitalDataPageLoad.page.pageInfo.errorCode = errorCode;
  digitalDataPageLoad.page.pageInfo.errorMessage = errorMsg;
  // if (window) {
  //   window.digitalData = digitalDataPageLoad || {};
  // }
  _satellite.track('pageload');
}

/**
* sendAnalytics
* @param {string} eventType
* @param {string} payload
* @param {string} journeyState
* @param {object} globals
*/
function sendAnalytics(eventType, payload, journeyState, globals) {
  if (eventType === 'page load') {
    sendPageloadEvent(journeyState, globals);
  } else {
    sendAnalyticsEvent(eventType, payload, journeyState, santizedFormDataWithContext(globals));
  }
}

/**
 * Sends an analytics event and performs additional asynchronous operations.
 *
 * @param {string} eventType - The type of the event to be sent.
 * @param {string} payload - The data to be sent with the event.
 * @param {string} journeyState - The state of the current journey.
 * @param {Object} globals - Global context or data required for the event.
 * @returns {Promise<object>} A promise that resolves with 'Success' if the operation is successful, or rejects with an error.
 */
function asyncAnalytics(eventType, payload, journeyState, globals) {
  return new Promise((resolve) => {
    try {
      sendAnalyticsEvent(eventType, payload, journeyState, santizedFormDataWithContext(globals));
      setTimeout(() => resolve({ response: 'success' }), 2000);
    } catch (ex) {
      console.log(ex);
    }
  });
}

export {
  sendPageloadEvent,
  sendAnalyticsEvent,
  sendErrorAnalytics,
  sendAnalytics,
  asyncAnalytics,
};
