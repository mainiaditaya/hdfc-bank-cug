/* eslint no-bitwise: ["error", { "allow": ["^", ">>", "&"] }] */

import { santizedFormData } from './formutils.js';
import { fetchJsonResponse } from './makeRestAPI.js';

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}

/**
 * generates the journeyId
 *
 * @param {string} visitMode - The visit mode (e.g., "online", "offline").
 * @param {string} journeyAbbreviation - The abbreviation for the journey.
 * @param {string} channel - The channel through which the journey is initiated.
 * @returns {string} - The generated journey ID.
 */
function createJourneyId(visitMode, journeyAbbreviation, channel) {
  const dynamicUUID = generateUUID();
  // var dispInstance = getDispatcherInstance();
  const journeyId = `${dynamicUUID}_01_${journeyAbbreviation}_${visitMode}_${channel}`;
  return journeyId;
}

const currentFormContext = {};

/**
 * @name invokeJourneyDropOff to log on success and error call backs of api calls.
 * @param {string} state
 * @param {string} mobileNumber
 * @param {Object} globals - globals variables object containing form configurations.
 */
const invokeJourneyDropOff = async (state, mobileNumber, globals) => {
  const journeyJSONObj = {
    RequestPayload: {
      userAgent: window.navigator.userAgent,
      leadProfile: {
        mobileNumber,
      },
      formData: {
        channel: 'ADOBE_WEBFORMS',
        journeyName: currentFormContext.journeyName,
        journeyID: currentFormContext.journeyID,
        journeyStateInfo: [
          {
            state,
            stateInfo: JSON.stringify(santizedFormData(globals)),
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
 * @name invokeJourneyDropOffParams to log on success and error call backs of api calls.
 * @param {Object} globals - globals variables object containing form configurations.
 */
const invokeJourneyDropOffParams = async (globals) => {
  const journeyJSONObj = {
    RequestPayload: {
        journeyInfo: {
            journeyID: currentFormContext.journeyID
        },
        leadProfile: {
            leadProfileId: currentFormContext.leadProfile
        }
    }
}
  const url = 'https://applyonlinedev.hdfcbank.com/content/hdfc_commonforms/api/journeydropoffparam.json';
  const method = 'POST';
  return fetchJsonResponse(url, journeyJSONObj, method);
};

/**
 * @name printPayload
 * @param {string} payload.
 */
function journeyResponseHandler(payload) {
  debugger;
  // eslint-disable-next-line no-console
  currentFormContext.leadProfile = String(payload.leadProfileId);
  console.log('message from here', payload);
}

export {
  createJourneyId, currentFormContext, invokeJourneyDropOff, journeyResponseHandler,
};
