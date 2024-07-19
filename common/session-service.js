import corpCreditCard from './constants.js';
import { urlPath } from './formutils.js';
import { getJsonResponse } from './makeRestAPI.js';

const { journeyInit } = corpCreditCard.endpoints;

/**
 * calling journey session init api.
 * @name initSession
 * @param {object} reqPayload - request payload
 * @param {object} eventHandlers - event handler of success & error in object.
 */
async function initSession(reqPayload, eventHandlers) {
  const url = urlPath(journeyInit);
  const method = 'POST';
  try {
    const responseObj = await getJsonResponse(url, reqPayload, method);
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
