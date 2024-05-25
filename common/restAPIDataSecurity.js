// eslint-disable-next-line no-use-before-define

const restAPIDataSecurityServiceContext = {
  SEC_KEY_HEADER: 'X-ENCKEY',
  SEC_SECRET_HEADER: 'X-ENCSECRET',
  crypto: (window.crypto || window.msCrypto),
  supportsES6: (!window.msCrypto),
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
function encryptDataES6(data, successCallback, errorCallback) {
  const secret = restAPIDataSecurityServiceContext.crypto.getRandomValues(new Uint8Array(restAPIDataSecurityServiceContext.secretLength));
  const dataBuf = stringToArrayBuffer(data);
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
    }).catch((error) => {
      errorCallback(error);
    }); // Encrypt random IV
  }).catch((error) => {
    errorCallback(error);
  }); // Encrypt data
}

/**
 * Encrypts data and invokes the callbacks
 */
function encryptData(data, successCallback, errorCallback) {
  try {
    if (restAPIDataSecurityServiceContext.initStatus) {
      if (restAPIDataSecurityServiceContext.supportsES6) {
        encryptDataES6((isStringEmpty(data) ? ' ' : data), successCallback, errorCallback);
      } else {
        encryptDataNoES6((isStringEmpty(data) ? ' ' : data), successCallback, errorCallback);
      }
    } else {
      errorCallback('DataEncryptionService not initialized');
    }
  } catch (errorObj) {
    if (errorCallback) {
      errorCallback(errorObj);
    }
  }
}
