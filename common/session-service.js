import corpCreditCard from './constants.js';
import { urlPath } from './formutils.js';
import { getJsonResponse } from './makeRestAPI.js';
import { corpCreditCardContext } from './journey-utils.js';

const { journeyInit } = corpCreditCard.endpoints;

const createSessionPayload = async (globals) => {
  try {
    const jsonObjForSessionApi = {
      requestString: {
        jid: globals.form.runtime.journeyId.$value || globals.functions.exportData()?.currentFormContext.journeyId || corpCreditCardContext.currentFormContext.journeyId,
        browserFingerPrint: '',
        clientIp: '',
        payloadEncrypted: '',
      },
    };
    return jsonObjForSessionApi;
  } catch (error) {
    throw new Error('Failed to create document payload', error);
  }
};

/**
 * calling journey session init api.
 * @name initSession
 * @param {object} eventHandlers - event handler of success & error in object.
 */
async function initSession(eventHandlers, globals) {
  const url = urlPath(journeyInit);
  const method = 'POST';
  const payload = await createSessionPayload(globals);
  try {
    const responseObj = await getJsonResponse(url, payload, method);
    if ((responseObj !== null) && ((responseObj.statusCode === 'SM00') || (responseObj.statusCode === 'SM01'))) {
      eventHandlers.successCallBack(responseObj);
    } else {
      eventHandlers.failureCallBack(responseObj);
    }
  } catch (error) {
    eventHandlers.failureCallBack(error);
  }
}

export default initSession;
