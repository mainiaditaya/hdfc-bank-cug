/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars

const digitalData = {
  page: {
    pageInfo: {
      pageName: 'CORPORATE_CARD_JOURNEY',
    },
  },
  user: {
    pseudoID: 'TBD',
    journeyID: '',
    journeyName: 'CORPORATE_CARD_JOURNEY',
    journeyState: '',
    casa: '',
  },
  form: {
    name: 'CORPORATE_CARD_JOURNEY',
  },
};


/**
 * send analytics call for click event
 * @name sendGenericEvent
 * @param {string} linkName - linkName
 * @param {string} linkType - linkName
 * @param {object} formContext - currentFormContext.
 */

function sendGenericClickEvent(linkName, linkType, formContext) {
  digitalData.link = {
    linkName,
    linkType,
  };
  digitalData.user.journeyID = formContext.journeyID;
  digitalData.user.journeyState = formContext?.journeyState;
  window.digitalData = digitalData || {};
  _satellite.track('event');
}

/**
 *Creates digital data for otp click event.
 * @param {string} phone
 * @param {string} validationType
 * @param {string} linkName
 * @param {string} linkType
 * @param {object} formContext
 */
function sendOtpClickEvent(phone, validationType, linkName, linkType, formContext) {
  digitalData.event = {
    phone,
    validationMethod: validationType === '0' ? 'DOB' : 'PAN',
  };
  sendGenericClickEvent(linkName, linkType, formContext);
}

/**
 * Sends analytics event on page load.
 * @name sendPageloadEvent
 * @param {object} formContext.
 */
function sendPageloadEvent(formContext) {
  digitalData.user.journeyID = formContext.journeyID;
  digitalData.user.journeyState = formContext?.journeyState || 'CUSTOMER_IDENTITY_UNRESOLVED';
  digitalData.user['Journey Name'] = 'CORPORATE_CARD_JOURNEY';
  if (window) {
    window.digitalData = digitalData || {};
  }
  _satellite.track('pageload');
}

export {
  sendPageloadEvent,
  sendOtpClickEvent,
  sendGenericClickEvent,
};
