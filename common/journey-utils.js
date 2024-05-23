/* eslint no-bitwise: ["error", { "allow": ["^", ">>", "&"] }] */

import { santizedFormDataWithContext } from './formutils.js';
import { fetchJsonResponse } from './makeRestAPI.js';
import { sendSubmitClickEvent } from './analytics.js';

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}

/**
 * generates the journeyId
 *
 * @param {string} visitMode - The visit mode (e.g., "online", "offline").
 * @param {string} journeyAbbreviation - The abbreviation for the journey.
 * @param {string} channel - The channel through which the journey is initiated.
 * @param {object} globals
 */
function createJourneyId(visitMode, journeyAbbreviation, channel, globals) {
  const dynamicUUID = generateUUID();
  // var dispInstance = getDispatcherInstance();
  const journeyId = `${dynamicUUID}_01_${journeyAbbreviation}_${visitMode}_${channel}`;
  globals.functions.setProperty(globals.form.runtime.journeyId, { value: journeyId });
}

const currentFormContext = {};

const getCurrentContext = () => currentFormContext;

const setCurrentContext = (formContext) => {
  this.currentFormContext = formContext;
  if (!this.currentFormContext.isSet) {
    this.currentFormContext.isSet = true;
  }
};

/**
 * @name invokeJourneyDropOff to log on success and error call backs of api calls
 * @param {string} mobileNumber
 * @param {object} currentFormContext
 * @param {Object} globals - globals variables object containing form configurations.
 */
const invokeJourneyDropOff = async (mobileNumber, formContext, globals) => {
  const journeyJSONObj = {
    RequestPayload: {
      userAgent: (typeof window !== 'undefined') ? window.navigator.userAgent : 'onLoad',
      leadProfile: {
        mobileNumber,
      },
      formData: {
        channel: 'ADOBE_WEBFORMS',
        journeyName: formContext.journeyName,
        journeyID: globals.form.runtime.journeyId.$value,
        journeyStateInfo: [
          {
            state: formContext?.journeyState,
            stateInfo: JSON.stringify(santizedFormDataWithContext(globals, formContext)),
            timeinfo: new Date().toISOString(),
          },
        ],
      },
    },
  };
  const url = 'https://applyonlinedev.hdfcbank.com/content/hdfc_commonforms/api/journeydropoff.json';
  const method = 'POST';
  return fetchJsonResponse(url, journeyJSONObj, method);
};

/**
 * @name invokeJourneyDropOffUpdate to log on success and error call backs of api calls.
 * @param {string} state
 * @param {string} mobileNumber
 * @param {string} linkName
 * @param {Object} formContext
 * @param {Object} globals - globals variables object containing form configurations.
 * @returns {Promise}
 */
const invokeJourneyDropOffUpdate = async (mobileNumber, linkName, formContext, globals) => {
  const sanitizedFormData = santizedFormDataWithContext(globals, formContext);
  const journeyJSONObj = {
    RequestPayload: {
      userAgent: window.navigator.userAgent,
      leadProfile: {
        mobileNumber,
        leadProfileId: formContext?.leadProfile?.leadProfileId,
      },
      formData: {
        channel: 'ADOBE_WEBFORMS',
        journeyName: formContext.journeyName,
        journeyID: globals.form.runtime.journeyId.$value,
        journeyStateInfo: [
          {
            state: formContext?.journeyState,
            stateInfo: JSON.stringify(sanitizedFormData),
            timeinfo: new Date().toISOString(),
          },
        ],
      },
    },
  };
  sendSubmitClickEvent(mobileNumber, linkName, sanitizedFormData);
  const url = 'https://applyonlinedev.hdfcbank.com/content/hdfc_commonforms/api/journeydropoffupdate.json';
  const method = 'POST';
  return fetchJsonResponse(url, journeyJSONObj, method);
};

/**
 * @name printPayload
 * @param {string} payload.
 * @param {object} formContext.
 * @returns {object} currentFormContext.
 */
function journeyResponseHandlerUtil(payload, formContext) {
  formContext.leadProfile = {};
  formContext.leadProfile.leadProfileId = String(payload);
  return formContext;
}

/**
 * @name invokeJourneyDropOff to log on success and error call backs of api calls
 * @param {string} mobileNumber
 * @param {object} globals - globals variables object containing form configurations.
 */
const invokeJourneyDropOffB = async (mobileNumber, globals) => {
  const journeyJSONObj = {
    RequestPayload: {
      userAgent: (typeof window !== 'undefined') ? window.navigator.userAgent : 'onLoad',
      leadProfile: {
        mobileNumber,
      },
      formData: {
        channel: 'ADOBE_WEBFORMS',
        journeyName: 'CORPORATE_CARD_JOURNEY',
        journeyID: globals.form.runtime.journeyId.$value,
        journeyStateInfo: [
          {
            state: 'CRM_LEAD_SUCCESS',
            stateInfo: '{}',
            timeinfo: new Date().toISOString(),
          },
        ],
      },
    },
  };
  const url = 'https://applyonlinedev.hdfcbank.com/content/hdfc_commonforms/api/journeydropoff.json';
  const method = 'POST';
  fetchJsonResponse(url, journeyJSONObj, method)
    .then((res) => {
      const leadId = String(res?.lead_profile_info?.leadProfileId);
      currentFormContext.leadProfile = {};
      currentFormContext.leadProfile.leadProfileId = leadId;
      globals.functions.setProperty(globals.form.runtime.leadProfileId, { value: leadId });
    })
    .catch((err) => {
      throw err;
    });
};

export {
  invokeJourneyDropOff, journeyResponseHandlerUtil, invokeJourneyDropOffUpdate, invokeJourneyDropOffB, currentFormContext, getCurrentContext, setCurrentContext, createJourneyId,
};
