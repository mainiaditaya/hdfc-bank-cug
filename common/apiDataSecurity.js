// eslint-disable-next-line no-use-before-define

const restAPIDataSecurityServiceContext = {
  SEC_KEY_HEADER: 'X-ENCKEY',
  SEC_SECRET_HEADER: 'X-ENCSECRET',
  crypto: (typeof window !== 'undefined') ? (window.crypto || window.msCrypto) : false,
  supportsES6: (typeof window !== 'undefined') ? (!window.msCrypto) : false,
  symmetricAlgo: 'AES-GCM',
  symmetricKeyLength: 256,
  secretLength: 12, // IV length
  secretTagLength: 128, // GCM tag length
  aSymmetricAlgo: 'RSA-OAEP',
  digestAlgo: 'SHA-256',
  initStatus: false,
  symmetricKey: null,
  encSymmetricKey: null,
  aSymmetricPublicKey: null,
};

/*
   * Convert a string into an array buffer
   */
function stringToArrayBuffer(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  // eslint-disable-next-line no-plusplus
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
/*
   * convert array buffer to string
   */
function arrayBufferToString(str) {
  const byteArray = new Uint8Array(str);
  let byteString = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return byteString;
}

function isStringEmpty(str) {
  return (!str || str.length === 0);
}

/**
 * Encrypts data
 */
function encryptDataES6(data, successCallback) {
  const dataStr = JSON.stringify(data);
  const secret = restAPIDataSecurityServiceContext.crypto.getRandomValues(new Uint8Array(restAPIDataSecurityServiceContext.secretLength));
  const dataBuf = stringToArrayBuffer(dataStr);
  restAPIDataSecurityServiceContext.crypto.subtle.encrypt({
    name: restAPIDataSecurityServiceContext.symmetricAlgo,
    iv: secret,
    tagLength: restAPIDataSecurityServiceContext.secretTagLength,
  }, restAPIDataSecurityServiceContext.symmetricKey, dataBuf).then((dataEncBuf) => {
    const dataEnc = btoa(arrayBufferToString(dataEncBuf));
    restAPIDataSecurityServiceContext.crypto.subtle.encrypt({
      name: restAPIDataSecurityServiceContext.aSymmetricAlgo,
      hash: {
        name: restAPIDataSecurityServiceContext.digestAlgo,
      },
    }, restAPIDataSecurityServiceContext.aSymmetricPublicKey, secret).then((encSecretBuf) => {
      const encSecret = btoa(arrayBufferToString(encSecretBuf));
      successCallback({
        dataEnc,
        secret,
        secretEnc: encSecret,
        keyEnc: restAPIDataSecurityServiceContext.encSymmetricKey,
      });
    });
});
}


/**
   * Prepares the request headers
   */
function getDataEncRequestHeaders(encDataPack) {
  const requestHeaders = {};
  requestHeaders[restAPIDataSecurityServiceContext.SEC_KEY_HEADER] = encDataPack.keyEnc;
  requestHeaders[restAPIDataSecurityServiceContext.SEC_SECRET_HEADER] = encDataPack.secretEnc;
  return requestHeaders;
}

/**
   * Initiates an http call with JSON payload to the specified URL using the specified method.
   *
   * @param {string} url - The URL to which the request is sent.
   * @param {string} [method='POST'] - The HTTP method to use for the request (default is 'POST').
   * @param {object} payload - The data payload to send with the request.
   * @returns {*} - The JSON response from the server.
   */
function getJsonResponse1(url, payload, method = 'POST') {
  // apiCall-fetch
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

/**
   * Adds custom headers to request headers
   */
function addCustomHeaders(headersObj, requestHeadersObj) {
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const header in headersObj) {
    requestHeadersObj[header] = headersObj[header];
  }
  return requestHeadersObj;
}

/**
   * Initialization in browsers where ES6 is supported
   */
function initRestAPIDataSecurityServiceES6() {
  debugger
  // eslint-disable-next-line max-len
  const publicKeyPemContent = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoAatblmEzZTQOT732FU38hiT9vCvGK12+pUD3yENyHXjk7oN1uWPlpItm5OAcsPZt52WznDkpOb/AxLBeJKFYZPvOk75lo6ZAA1qyJEOekQru5XQUtpMzsC9w96T2zTYQQ4HUwMNXmYkWIVo4Ek/KCfX2yklRHxwm3Pqj93vJkUmoddLctXArddtm75HUjtYzf5jecQCGk//pyjTDJEswMpg3oXNiI2F1PnDUiKdQBE7+a1s5KB7CAKKYQLFNN48kjiOdDutMByjZxW0elPs9ETVU+NVNQ6ru9vKQYzvR/2YD7NNSHPUCpdexIpfiYeWrxUNgpHLM2qfXTOvn6UztQIDAQAB';
  // Base64 decode
  const binaryDerString = atob(publicKeyPemContent);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = stringToArrayBuffer(binaryDerString);
  // Import asymmetric public key
  restAPIDataSecurityServiceContext.crypto.subtle.importKey('spki', binaryDer, {
    name: restAPIDataSecurityServiceContext.aSymmetricAlgo,
    hash: restAPIDataSecurityServiceContext.digestAlgo,
  }, true, ['encrypt']).then((publicKey) => {
    restAPIDataSecurityServiceContext.aSymmetricPublicKey = publicKey;
    // Creates the symmteric key
    restAPIDataSecurityServiceContext.crypto.subtle.generateKey({
      name: restAPIDataSecurityServiceContext.symmetricAlgo,
      length: restAPIDataSecurityServiceContext.symmetricKeyLength,
    }, true, ['encrypt', 'decrypt']).then((symKey) => {
      restAPIDataSecurityServiceContext.symmetricKey = symKey;
      // Export the symmetric key for further use
      restAPIDataSecurityServiceContext.crypto.subtle.exportKey('raw', restAPIDataSecurityServiceContext.symmetricKey).then((symKeyData) => {
        const symmetricKeyData = symKeyData;
        // Encrypting the symmetric key with assymetric key
        restAPIDataSecurityServiceContext.crypto.subtle.encrypt({
          name: restAPIDataSecurityServiceContext.aSymmetricAlgo,
          hash: {
            name: restAPIDataSecurityServiceContext.digestAlgo,
          },
        }, restAPIDataSecurityServiceContext.aSymmetricPublicKey, symmetricKeyData).then((encSymmetricKeyBuf) => {
          restAPIDataSecurityServiceContext.encSymmetricKey = btoa(arrayBufferToString(encSymmetricKeyBuf));
          // Mark the initialization status
          restAPIDataSecurityServiceContext.initStatus = true;
        }); // Encrypt symmetric key with asymmetric public key
      }); // Export symmetric key
    }); // Generate symmetric key
  }); // Import asymmetric public key
}

/**
   * @name invokeRestAPIWithDataSecurity
   */
function invokeRestAPIWithDataSecurity(data, successCallback) {
  debugger;
  encryptDataES6(data, successCallback);
}

export {
  getDataEncRequestHeaders, invokeRestAPIWithDataSecurity, initRestAPIDataSecurityServiceES6,
};
