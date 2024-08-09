/**
 * Displays a loader with optional loading text.
 * @param {string} loadingText - The loading text to display (optional).
 */
import { decryptDataES6, invokeRestAPIWithDataSecurity } from './apiDataSecurity.js';

import corpCreditCard from './constants.js';

const { env } = corpCreditCard;

function displayLoader(loadingText) {
  const bodyContainer = document.querySelector('.appear');
  bodyContainer.classList.add('preloader');
  if (loadingText) {
    bodyContainer.setAttribute('loader-text', loadingText);
  }
}

/**
 * Hides the loader.
 * @return {PROMISE}
 */
function hideLoaderGif() {
  const bodyContainer = document.querySelector('.appear');
  bodyContainer.classList.remove('preloader');
  if (bodyContainer.hasAttribute('loader-text')) {
    bodyContainer.removeAttribute('loader-text');
  }
}

/**
* Initiates an http call with JSON payload to the specified URL using the specified method.
*
* @param {string} url - The URL to which the request is sent.
* @param {string} [method='POST'] - The HTTP method to use for the request (default is 'POST').
* @param {object} payload - The data payload to send with the request.
* @returns {*} - The JSON response from the server.
*/
async function fetchJsonResponse(url, payload, method, loader = false, globals) {
  const currentDate = new Date();
  try {
    if (env === 'dev') {
      return fetch(url, {
        method,
        body: payload ? JSON.stringify(payload) : null,
        mode: 'cors',
        headers: {
          'Content-type': 'text/plain',
          Accept: 'application/json',
          journeyID: globals ? (globals.form.runtime.journeyId.$value || globals.functions.exportData()?.currentFormContext.journeyId) : null,
          iat: btoa(currentDate.getTime()),
        },
      })
        .then((res) => {
          if (loader) hideLoaderGif();
          return res.json();
        });
    }

    const responseObj = await invokeRestAPIWithDataSecurity(payload);
    const response = await fetch(url, {
      method,
      body: responseObj.dataEnc,
      mode: 'cors',
      headers: {
        'Content-type': 'text/plain',
        Accept: 'text/plain',
        'X-Enckey': responseObj.keyEnc,
        'X-Encsecret': responseObj.secretEnc,
      },
    });
    const result = await response.text();
    const decryptedResult = await decryptDataES6(result, responseObj.secret);
    if (loader) hideLoaderGif();
    return JSON.parse(decryptedResult);
  } catch (error) {
    console.error('Error in fetching JSON response:', error);
    throw error;
  }
}

/**
* Initiates an http call with JSON payload to the specified URL using the specified method.
*
* @param {string} url - The URL to which the request is sent.
* @param {string} [method='POST'] - The HTTP method to use for the request (default is 'POST').
* @param {object} payload - The data payload to send with the request.
* @returns {*} - The JSON response from the server.
*/
async function fetchIPAResponse(url, payload, method, ipaDuration, ipaTimer, loader = false, startTime = Date.now()) {
  try {
    if (env === 'dev') {
      return fetch(url, {
        method,
        body: payload ? JSON.stringify(payload) : null,
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((response) => {
          const ipaResult = response?.ipa?.ipaResult;
          if (ipaResult && ipaResult !== '' && ipaResult !== 'null' && ipaResult !== 'undefined') {
            if (loader) hideLoaderGif();
            return response;
          }
          return response;
        });
    }
    const responseObj = await invokeRestAPIWithDataSecurity(payload);
    const response = await fetch(url, {
      method,
      body: responseObj.dataEnc,
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        'X-Enckey': responseObj.keyEnc,
        'X-Encsecret': responseObj.secretEnc,
      },
    });
    const result = await response.text();
    const decryptedResult = await decryptDataES6(result, responseObj.secret);
    const formattedResult = JSON.parse(decryptedResult);
    const ipaResult = formattedResult?.ipa?.ipaResult;

    if (ipaResult && ipaResult !== '' && ipaResult !== 'null' && ipaResult !== 'undefined') {
      if (loader) hideLoaderGif();
      return formattedResult;
    }

    const elapsedTime = (Date.now() - startTime) / 1000;
    if (elapsedTime < parseInt(ipaDuration, 10) - 10) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const res = await fetchIPAResponse(url, payload, method, ipaDuration, ipaTimer, true, startTime);
          resolve(res);
        }, ipaTimer * 1000);
      });
    }

    return result;
  } catch (error) {
    console.error('Error in fetching IPA response:', error);
    throw error;
  }
}

/**
 * Initiates an http call with JSON payload to the specified URL using the specified method.
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} [method='POST'] - The HTTP method to use for the request (default is 'POST').
 * @param {object} payload - The data payload to send with the request.
 * @returns {*} - The JSON response from the server.
 */
async function getJsonResponse(url, payload, method = 'POST') {
  try {
    if (env === 'dev') {
      return fetch(url, {
        method,
        body: payload ? JSON.stringify(payload) : null,
        mode: 'cors',
        headers: {
          'Content-type': 'text/plain',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .catch((err) => {
          throw err;
        });
    }
    const responseObj = await invokeRestAPIWithDataSecurity(payload);
    const response = await fetch(url, {
      method,
      body: responseObj.dataEnc,
      mode: 'cors',
      headers: {
        'Content-type': 'text/plain',
        Accept: 'text/plain',
        'X-Enckey': responseObj.keyEnc,
        'X-Encsecret': responseObj.secretEnc,
      },
    });
    const result = await response.text();
    const decryptedResult = await decryptDataES6(result, responseObj.secret);
    return JSON.parse(decryptedResult);
  } catch (error) {
    console.error('Error in fetching JSON response:', error);
    throw error;
  }
}

/**
 * Makes a REST API call with the provided parameters.
 *
 * @param {object} globals - The global object containing necessary globals form data.
 * @param {string} method - The HTTP method to use for the request (e.g., 'GET', 'POST').
 * @param {object} payload - The data payload to send with the request.
 * @param {string} path - The endpoint or path for the API call.
 * @param {string} loadingText - The loading text during the API call.
 * @callback successCallback - The callback function to handle after successful API response.
 * @callback errorCallback - The callback function to handle after errors during the API call.
 */
async function restAPICall(globals, method, payload, path, successCallback, errorCallback, loadingText) {
  try {
    if (loadingText) displayLoader(loadingText);

    const res = await getJsonResponse(path, payload, method);

    if (res) {
      if (loadingText) hideLoaderGif();
      successCallback(res, globals);
    }
  } catch (err) {
    if (loadingText) hideLoaderGif();
    errorCallback(err, globals);
  }
}

/**
 * Executes a series of chained asynchronous fetch requests.
 *
 * @param {string} apiUrl - The URL endpoint for the API.
 * @param {string} method - The HTTP method for the requests (e.g., 'POST', 'PUT').
 * @param {Array<any>} payloadArray - Array of payloads to send in the requests.
 * @param {string} payloadType - Type of payload, accepts'formData' to send as FormData (without stringify) or 'json'(with stringify).
 * @returns {Promise<Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }>>}
 * A promise that resolves to an array of promise settlement records.
 */
const chainedFetchAsyncCall = async (apiUrl, method, payloadArray, payloadType) => {
  const promises = payloadArray?.map(async (dataLoad) => {
    const jsonContentType = {
      mode: 'cors',
      headers: {
        'Content-type': 'text/plain', // Adjusted content-type based on payloadType,
        Accept: 'application/json',
      },
    };
    const typeFormData = (payloadType === 'formData');
    const formDataContentType = {
      method,
      body: typeFormData ? dataLoad : JSON.stringify(dataLoad),
    };
    const contentType = typeFormData ? formDataContentType : ({ ...formDataContentType, ...jsonContentType });
    try {
      const response = await fetch(apiUrl, contentType);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  });
  const fileResponses = await Promise.allSettled(promises);
  return fileResponses;
};

export {
  restAPICall,
  getJsonResponse,
  displayLoader,
  hideLoaderGif,
  fetchJsonResponse,
  fetchIPAResponse,
  chainedFetchAsyncCall,
};
