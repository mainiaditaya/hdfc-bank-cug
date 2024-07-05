import {
  data,
  ANALYTICS_OBJECT,
} from './analyticsConstants.js';
import corpCreditCard from './constants.js';
import createDeepCopyFromBlueprint from './formutils.js';
import { corpCreditCardContext } from './journey-utils.js';

const { currentFormContext } = corpCreditCardContext;

const digitalDataPageLoad = {
  page: {
    pageInfo: {
      pageName: corpCreditCard.journeyName,
      errorCode: '',
      errorMessage: '',
    },
  },
  user: {
    pseudoID: 'TBD',
    journeyID: '',
    journeyName: corpCreditCard.journeyName,
    journeyState: '',
    casa: '',
  },
  form: {
    name: 'Corporate credit card',
  },
};

/**
 * send analytics call for click event
 * @name sendGenericEvent
 * @param {string} linkName - linkName
 * @param {string} linkType - linkName
 * @param {object} formContext - currentFormContext.
 * @param {object} digitalData
 */

function sendGenericClickEvent(linkName, linkType, formData, digitalData) {
  const digitalDataEvent = digitalData || {};
  digitalDataEvent.link = {
    linkName,
    linkType,
  };
  digitalDataEvent.user.journeyID = formData?.currentFormContext?.journeyID;
  digitalDataEvent.user.journeyState = formData?.currentFormContext?.journeyState;
  digitalDataEvent.event = {};
  window.digitalData = digitalDataEvent || {};
}

const getValidationMethod = (formContext) => {
  if (formContext && formContext?.login && formContext.login.panDobSelection) {
    return formContext.login.panDobSelection === '0' ? 'DOB' : 'PAN';
  }
  return '';
};

/**
 *Creates digital data for otp click event.
 * @param {string} phone
 * @param {string} validationType
 * @param {string} eventType
 * @param {object} formContext
 * @param {object} digitalData
 */
function sendSubmitClickEvent(phone, eventType, linkType, formData, digitalDataEvent) {
  digitalDataEvent.page.pageInfo = corpCreditCard.journeyName;
  digitalDataEvent.user.journeyName = corpCreditCard.journeyName;
  digitalDataEvent.form.name = 'Corporate credit card';
  digitalDataEvent.link.linkPosition = 'form';
  sendGenericClickEvent(eventType, linkType, formData, digitalDataEvent);
  switch (eventType) {
    case 'get otp': {
      digitalDataEvent.event = {
        phone,
        validationMethod: getValidationMethod(formData),
      };
      break;
    }
    case 'check offers': {
      digitalDataEvent.user = {
        gender: 'Male',
        email: 'hardcodedMailId@gmail.com',
      };
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
      break;
    }

    case 'get this card': {
      digitalDataEvent.card = {
        selectedCard: formData.form.productCode,
        annualFee: formData.form.joiningRenewalFee,
      };
      digitalDataEvent.event = {
        status: formData.cardBenefitsAgreeCheckbox,
      };
      break;
    }
    default: {
      /* empty */
    }
  }
  window.digitalData = digitalDataEvent || {};
  // eslint-disable-next-line no-undef
  _satellite.track('submit');
}

/**
 * Sends analytics event on page load.
 * @name sendPageloadEvent
 * @param {object} formContext.
 */
function sendPageloadEvent(formContext) {
  digitalDataPageLoad.user.journeyID = formContext.journeyID;
  digitalDataPageLoad.user.journeyState = formContext?.journeyState || 'CUSTOMER_IDENTITY_UNRESOLVED';
  digitalDataPageLoad.user['Journey Name'] = corpCreditCard.journeyName;
  if (window) {
    window.digitalData = digitalDataPageLoad || {};
  }
  // eslint-disable-next-line no-undef
  _satellite.track('pageload');
}

function populateResponse(payload, eventType, digitalDataEvent) {
  switch (eventType) {
    case 'otp click': {
      digitalDataEvent.page.pageInfo.errorCode = payload?.status?.errorCode;
      digitalDataEvent.page.pageInfo.errorMessage = payload?.status?.errorMessage;
      break;
    }
    case 'check offers':
    case 'get this card': {
      digitalDataEvent.page.pageInfo.errorCode = payload?.errorCode;
      digitalDataEvent.page.pageInfo.errorMessage = payload?.errorMessage;
      break;
    }
    default: {
      /* empty */
    }
  }
}

/**
 * Send analytics events.
 * @param {string} eventType
 * @param {object} payload
 * @param {object} formData
 * @param {object} currentFormContext
 */
function sendAnalyticsEvent(eventType, payload, formData) {
  const digitalDataEvent = createDeepCopyFromBlueprint(ANALYTICS_OBJECT);
  const apiResponse = JSON.parse(payload || {});
  const attributes = data[eventType];
  populateResponse(apiResponse, eventType, digitalDataEvent);
  sendSubmitClickEvent(formData?.login?.registeredMobileNumber, eventType, attributes?.linkType, formData, digitalDataEvent);
}

export {
  digitalDataPageLoad,
  sendPageloadEvent,
  sendSubmitClickEvent,
  sendGenericClickEvent,
  sendAnalyticsEvent,
};
