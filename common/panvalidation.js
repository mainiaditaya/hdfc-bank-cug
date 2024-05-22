import { fetchJsonResponse } from './makeRestAPI.js';
import {
  urlPath,
  convertDateToDdMmYyyy,
} from './formutils.js';
import { currentFormContext } from './journey-utils.js';

/**
 * validatePan - creates PAN validation request and executes API.
 * @param {string} mobileNumber
 * @param {string} panNumber
 * @param {object} dob
 * @param {string} firstName
 * @param {boolean} showLoader
 * @param {boolean} hideLoader
 * @returns {Promise} - pan validation response
 */
const validatePan = (mobileNumber, panNumber, dob, firstName, showLoader, hideLoader) => {
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
  if (showLoader) currentFormContext?.validatePanLoader();
  const apiEndPoint = urlPath('/content/hdfc_forms_common_v2/api/panValNameMatch.json');
  return fetchJsonResponse(apiEndPoint, validatePanRequest, 'POST', hideLoader);
};

/**
* panAPISuccesHandler
* @param {string} panStatus
* @returns {Promise} panResponse
*/
function panAPISuccesHandler(panStatus) {
  let panSuccess = false;
  const journeyType = currentFormContext?.journeyType;
  const restrictedStatus = ['D', 'ED', 'X', 'F'];
  if (panStatus === 'E') {
    panSuccess = true;
  } else if (journeyType === 'ETB' && !restrictedStatus.includes(panStatus)) {
    panSuccess = true;
  }

  const returnObj = {
    panSuccess,
  };
  return returnObj;
}

export {
  validatePan,
  panAPISuccesHandler,
};

export default validatePan;
