import {
  corpCreditCardContext,
  formRuntime,
} from './journey-utils.js';
import { urlPath } from './formutils.js';
import { fetchJsonResponse } from './makeRestAPI.js';
import * as CONSTANT from './constants.js';
import * as CC_CONSTANT from '../creditcards/corporate-creditcard/constant.js';

const { currentFormContext } = corpCreditCardContext;
const { ENDPOINTS } = CONSTANT;
const { ID_COM } = CC_CONSTANT;
const idCom = ID_COM;

/**
 * Creates an IdCom request object based on the provided global data.
 * @param {Object} globals - The global object containing necessary data for IdCom request.
 * @returns {Object} - The IdCom request object.
 */
const createIdComRequestObj = (globals) => {
  const segment = formRuntime?.segment || globals.functions.exportData().currentFormContext.breDemogResponse.SEGMENT.toLowerCase();
  const isAddressEdited = globals.functions.exportData().form.currentAddressToggle === 'on' ? 'yes' : 'no';
  let scope = '';

  if (segment in idCom.scopeMap) {
    if (typeof idCom.scopeMap[segment] === 'object') {
      scope = idCom.scopeMap[segment][isAddressEdited];
    } else {
      scope = idCom.scopeMap[segment];
    }
  }
  const idComObj = {
    requestString: {
      mobileNumber: globals.form.loginPanel.mobilePanel.registeredMobileNumber.$value,
      ProductCode: idCom.productCode,
      PANNo: (globals.form.corporateCardWizardView.yourDetailsPanel.yourDetailsPage.personalDetails.panNumberPersonalDetails.$value)?.toUpperCase(),
      userAgent: navigator.userAgent,
      journeyID: currentFormContext?.journeyID || globals.functions.exportData().currentFormContext.journeyID,
      journeyName: currentFormContext.journeyName,
      scope,
    },
  };
  return idComObj;
};

/**
 * Fetches an authentication code from the API.
 *
 * This function creates an idcomm request object, constructs the API endpoint URL,
 * and then sends a POST request to the endpoint to fetch the authentication code.
 * @name fetchAuthCode
 * @params {object} globals
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the API.
 */
const fetchAuthCode = (globals) => {
  currentFormContext.VISIT_TYPE = 'IDCOMM';
  const idComRequest = createIdComRequestObj(globals);
  const apiEndPoint = urlPath(ENDPOINTS.fetchAuthCode);
  return fetchJsonResponse(apiEndPoint, idComRequest, 'POST');
};

export default fetchAuthCode;
