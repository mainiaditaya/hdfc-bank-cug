/* eslint-disable no-undef */
import {
  data,
  ANALYTICS_CLICK_OBJECT,
  ANALYTICS_PAGE_LOAD_OBJECT,
  PAGE_NAME,
} from '../../common/analyticsConstants.js';
import {
  createDeepCopyFromBlueprint,
  santizedFormDataWithContext,
} from '../../common/formutils.js';
import { FORM_NAME } from './constant.js';
import { CURRENT_FORM_CONTEXT as currentFormContext } from '../../common/constants.js';

/**
   * set analytics generic props for page load
   * @name setAnalyticPageLoadProps
   * @param {string} linkName - linkName
   * @param {string} linkType - linkName
   * @param {object} formContext - currentFormContext.
   * @param {object} digitalData
   */

function setAnalyticPageLoadProps(journeyState, formData, digitalData) {
  digitalData.user.pseudoID = '';// Need to check
  digitalData.user.journeyName = currentFormContext?.journeyName;
  digitalData.user.journeyID = formData?.journeyId;
  digitalData.user.journeyState = journeyState;
  digitalData.user.casa = '';
  digitalData.form.name = FORM_NAME;
}

/**
   * set analytics generic props for click event
   * @name setAnalyticClickGenericProps
   * @param {string} linkName - linkName
   * @param {string} linkType - linkName
   * @param {object} formContext - currentFormContext.
   * @param {object} digitalData
   */

function setAnalyticClickGenericProps(linkName, linkType, formData, journeyState, digitalData) {
  digitalData.link = {
    linkName,
    linkType,
  };
  digitalData.link.linkPosition = data[linkName].linkPosition;
  digitalData.user.pseudoID = '';
  digitalData.user.journeyName = currentFormContext?.journeyName;
  digitalData.user.journeyID = currentFormContext?.journeyID;
  digitalData.user.journeyState = journeyState;
  if (linkName === 'otp click') {
    digitalData.form.name = FORM_NAME;
    digitalData.user.casa = '';
  } else {
    digitalData.form.name = formData.etbFlowSelected === 'on' ? `${FORM_NAME}-ETB` : `${FORM_NAME}-NTB`;
    digitalData.user.casa = formData.etbFlowSelected === 'on' ? 'Yes' : 'No';
  }
  // window.digitalData = digitalData || {};
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
   * @param {string} pageName.
   */
function sendPageloadEvent(journeyState, formData, pageName) {
  const digitalData = createDeepCopyFromBlueprint(ANALYTICS_PAGE_LOAD_OBJECT);
  digitalData.page.pageInfo.pageName = pageName;
  setAnalyticPageLoadProps(journeyState, formData, digitalData);
  switch (currentFormContext.action) {
    case 'check offers': {
      digitalData.page.pageInfo.pageName = PAGE_NAME.ccc['get this card'];
      digitalData.card.selectedCard = currentFormContext?.productCode;
      digitalData.card.eligibleCard = currentFormContext?.productCode;
      break;
    }
    case 'confirmation': {
      // ((mobileValid === 'n')&&aadhaar_otp_val_data?.result?.mobileValid)
      // arn_num
      digitalData.page.pageInfo.pageName = PAGE_NAME.ccc['start kyc'];
      const formCallBackContext = currentFormContext?.pageGotRedirected ? formData?.currentFormContext : currentFormContext;
      digitalData.formDetails = {
        reference: formCallBackContext?.ARN_NUM,
        isVideoKYC: formCallBackContext?.isVideoKYC ? 'Yes' : 'no', // value - ? 'yes' or 'no' if aadhar and then applicationMismatch
      };
      break;
    }
    default:
        // do nothing
  }
  if (window) {
    window.digitalData = digitalData || {};
  }
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
function sendSubmitClickEvent(phone, eventType, linkType, formData, journeyState, digitalData) {
  setAnalyticClickGenericProps(eventType, linkType, formData, journeyState, digitalData);
  digitalData.page.pageInfo.pageName = PAGE_NAME.ccc[eventType];
  switch (eventType) {
    case 'otp click': {
      digitalData.event = {
        phone,
        validationMethod: getValidationMethod(formData),
      };
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('submit');
      currentFormContext.action = 'otp click';
      setTimeout(() => {
        sendPageloadEvent('CUSTOMER_IDENTITY_RESOLVED', formData, PAGE_NAME.ccc['confirm otp']);
      }, 1000);
      break;
    }
    case 'confirm otp': {
      setTimeout(() => {
        sendPageloadEvent('CUSTOMER_IDENTITY_RESOLVED', formData, PAGE_NAME.ccc['check offers']);
      }, 1000);
      break;
    }
    case 'check offers': {
      digitalData.user.gender = formData.form.gender;
      digitalData.user.email = formData.form.workEmailAddress;
      if (formData.form.currentAddressToggle === 'off') {
        digitalData.formDetails = {
          pincode: currentFormContext?.breDemogResponse?.VDCUSTZIPCODE,
          city: currentFormContext?.breDemogResponse?.VDCUSTCITY,
          state: currentFormContext?.breDemogResponse?.VDCUSTSTATE,
        };
      } else {
        const isETB = currentFormContext.journeyType === 'ETB';
        digitalData.formDetails = {
          pincode: isETB ? formData?.form?.newCurentAddressPin : formData?.form?.currentAddresPincodeNTB,
          city: isETB ? 'hardcodedETBCity' : 'hardcodedNTBCity',
          state: isETB ? 'hardcodedETBState' : 'hardcodedNTBState',
        };
      }
      Object.assign(digitalData.formDetails, {
        employmentType: formData?.form?.employmentType,
        companyName: formData?.form?.companyName,
        designation: formData?.form?.designation,
        relationshipNumber: formData?.form?.relationshipNumber,
      });
      currentFormContext.action = 'check offers';
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('submit');
      setTimeout(() => {
        sendPageloadEvent('CUSTOMER_BUREAU_OFFER_AVAILABLE', formData, PAGE_NAME.ccc['get this card']);
      }, 1000);
      break;
    }

    case 'get this card': {
      digitalData.card = {
        selectedCard: formData?.form?.productCode,
        annualFee: formData?.form?.joiningandRenewalFee,
      };
      // digitalData.event = {
      //   status: formData.cardBenefitsAgreeCheckbox,
      // };
      currentFormContext.action = 'confirmation';
      if (window) {
        window.digitalData = digitalData || {};
      }
      currentFormContext.action = 'get this card';
      _satellite.track('submit');
      setTimeout(() => {
        let currentPageName = 'Select KYC Method';
        if (formData?.etbFlowSelected === 'on' && formData?.form?.currentAddressToggle === 'off') {
          currentPageName = 'Confirm & Submit';
        }
        sendPageloadEvent('CUSTOMER_CARD_SELECTED', formData, currentPageName);
      }, 1000);
      break;
    }

    case 'address continue': {
      // formData?.queryParams?.authmode
      // const formData = globals.functions.exportData();
      // const idcomVisit = formData?.queryParams?.authmode; // "DebitCard"
      digitalData.event = {
        status: formData?.form?.cardDeliveryAddressOption1 || formData?.form?.cardDeliveryAddressOption2,
        validationMethod: '', // Netbanking or Debit card - validationMethod - authmode will be getting only after idcom redirected - how to use that value
      };
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('submit');
      break;
    }

    case 'kyc continue': {
      const kyc = (formData?.form?.aadharEKYCVerification && 'Ekyc') || (formData?.form?.aadharBiometricVerification && 'Biometric') || (formData?.form?.officiallyValidDocumentsMethod && 'Other Docs');
      digitalData.formDetails = {
        KYCVerificationMethod: kyc,
      };
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('submit');
      break;
    }

    case 'aadhaar otp': {
      // UID OR VID  how to capture the value - aadhar in different portal.
      digitalData.event = {
        status: '',
      };
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('submit');
      break;
    }

    case 'document upload continue': {
      digitalData.formDetails = {
        documentProof: formData?.docUploadDropdown, // documentType
      };
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('submit');
      break;
    }

    case 'start kyc': {
      // ETB_ Capture clicks on Start vKYC CTA, Applicable only for ETB Address Change, Only in case of Aadhaar and Application no. mismatch
      // NTB_ '1'(default without any condition)
      digitalData.event = {
        status: '1', // formData?.vkycProceedButton, //  value is '1' or '0' for -e63 capture
      };
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('submit');
      break;
    }

    case 'submit review': {
      // common both ntb + etb
      digitalData.event = {
        rating: formData?.ratingvalue,
      };
      if (window) {
        window.digitalData = digitalData || {};
      }
      _satellite.track('survey');
      break;
    }
    default:
        // do nothing
  }
}

function populateResponse(payload, eventType, digitalData) {
  switch (eventType) {
    case 'otp click': {
      digitalData.page.pageInfo.errorCode = payload?.status?.errorCode;
      digitalData.page.pageInfo.errorMessage = payload?.status?.errorMessage;
      break;
    }
    case 'check offers':
    case 'document upload continue':
    case 'aadhaar otp':
    case 'kyc continue':
    case 'get this card':
    case 'submit review':
    case 'address continue':
    case 'start kyc': {
      digitalData.page.pageInfo.errorCode = payload?.errorCode;
      digitalData.page.pageInfo.errorMessage = payload?.errorMessage;
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
  const digitalData = createDeepCopyFromBlueprint(ANALYTICS_CLICK_OBJECT);
  const attributes = data[eventType];
  populateResponse(payload, eventType, digitalData);
  sendSubmitClickEvent(formData?.login?.registeredMobileNumber, eventType, attributes?.linkType, formData, journeyState, digitalData);
}

/**
  * sendErrorAnalytics
  * @param {string} errorCode
  * @param {string} errorMsg
  * @param {string} journeyState
  * @param {object} globals
  */
function sendErrorAnalytics(errorCode, errorMsg, journeyState, globals) {
  const digitalData = createDeepCopyFromBlueprint(ANALYTICS_PAGE_LOAD_OBJECT);
  setAnalyticPageLoadProps(journeyState, santizedFormDataWithContext(globals), digitalData);
  digitalData.page.pageInfo.errorCode = errorCode;
  digitalData.page.pageInfo.errorMessage = errorMsg;
  if (window) {
    window.digitalData = digitalData || {};
  }
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
  const formData = santizedFormDataWithContext(globals);
  if (eventType.includes('page load')) {
    const pageName = eventType.split('-')[1];
    sendPageloadEvent(journeyState, formData, pageName);
  } else {
    sendAnalyticsEvent(eventType, payload, journeyState, formData);
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
      console.error(ex);
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
