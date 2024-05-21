import { fetchJsonResponse } from './makeRestAPI.js';
import {
  urlPath,
  convertDateToDdMmYyyy,
} from './formutils.js';
import { currentFormContext } from './journey-utils.js';
import { } from './formutils.js';

/**
 * validatePan - creates PAN validation request and executes API.
 * @param {string} mobileNumber
 * @param {string} panNumber
 * @param {object} dob
 * @param {string} firstName
 * @returns {Promise} - pan validation response
 */
function validatePan(mobileNumber, panNumber, dob, firstName) {
  const validatePanRequest = {
    journeyName: currentFormContext.journeyName,
    journeyID: currentFormContext.journeyID,
    mobileNumber,
    panInfo: {
      panNumber,
      panType: 'P',
      dob: convertDateToDdMmYyyy(new Date(dob)),
      name: firstName ? firstName.split(' ')[0] : '',
    },
  };
  const apiEndPoint = urlPath('/content/hdfc_forms_common_v2/api/panValNameMatch.json');
  return fetchJsonResponse(apiEndPoint, validatePanRequest, 'POST', true);
}

export {
  validatePan,
};
