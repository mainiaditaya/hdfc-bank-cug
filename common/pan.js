const PANValidationAndNameMatchService = PANValidationAndNameMatchService || {};

PANValidationAndNameMatchService.doValidation = function (reqPayload, eventHandlers) {
  debugger;
  // /**
  //  * Common framework for calling pan validation api.
  //  * @param {Object} reqObj
  //  * @param {Object} eventHandlers
  //  * @returns
  //  */
  // var doValidation = function (reqPayload, eventHandlers) {

  try {
    const apiEndPoint = '/content/hdfc_forms_common_v2/api/panValNameMatch.json';

    if (isRequestProcessable(reqPayload) && isEventHandlerProcessable(eventHandlers)) {
        debugger;
      makeRestAPICall(
        guideBridge.resolveNode('dataSecurityEnabled').value,
        apiEndPoint,
        'POST',
        reqPayload,
        'application/json',
        'json',
        eventHandlers.beforeSendCallBack,
        eventHandlers.afterSendCallBack,
        (responseObj) => {
          eventHandlers.successCallBack(responseObj);
        },
        (errorObj) => {
          eventHandlers.failureCallBack(errorObj);
        },
      );
    } else {
      throw new Error('argument error');
    }
  } catch (e) {
    const errorObj = {};
    errorObj.value = e;
    errorObj.status = false;
    return errorObj;
  }
};

/**
 * For checking empty value
 * @param {String} data
 * @returns Boolean
 */
function containsValue(data) {
  return ((typeof data !== undefined) && data !== null && data !== '');
}

/**
 * For checking request object has required value or not
 * @param {Object} reqObj
 * @returns
 */
function isRequestProcessable(reqObj) {
  return (typeof reqObj !== undefined
          && containsValue(reqObj.mobileNumber)
          && containsValue(reqObj.journeyID)
          && containsValue(reqObj.journeyName)
          && (reqObj.panInfo !== undefined && isPanObjRequestProcessable(reqObj.panInfo))
          || (reqObj.nameInfo !== undefined && isNameMatchObjRequestProcessable(reqObj.nameInfo)));
}

/**
 * For checking method referece object has required value or not
 * @param {Object} reqObj
 * @returns
 */
function isEventHandlerProcessable(eventHandlers) {
  return ((typeof eventHandlers !== undefined)
          && eventHandlers !== null
          && isReferenceOfTypeFunction(eventHandlers.successCallBack)
          && isReferenceOfTypeFunction(eventHandlers.failureCallBack)
          && isReferenceOfTypeFunction(eventHandlers.beforeSendCallBack)
          && isReferenceOfTypeFunction(eventHandlers.afterSendCallBack));
}

/**
 * For checking referece is of type 'function'
 * @param {Function referece} methodReference
 * @returns
 */
function isReferenceOfTypeFunction(methodReference) { // return
  return typeof methodReference === 'function';
}

/**
 * For checking Pan request object have required value or not
 * @param {Object} panObj
 * @returns
 */
function isPanObjRequestProcessable(panObj) {
  if (containsValue(panObj.panNumber)
      && containsValue(panObj.panType)
      && panObj.dob === undefined) { // Optional
    return true;
  }
  if (containsValue(panObj.panNumber)
           && containsValue(panObj.panType) // Pass P for personal, NP for non-personal
           && panObj.dob !== undefined
           && checkPanDobFormat(panObj.dob)) {
    return true;
  }

  return false;
}

/**
 * For checking DOB format DD/MM/YYYY
 * @param {String} dob
 */
function checkPanDobFormat(dob) {
  const pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  return pattern.test(dob);
}

/**
 * For checking Name Match request object have required value or not
 * @param {Object} nameMatchObj
 * @returns
 */
function isNameMatchObjRequestProcessable(nameMatchObj) {
  return containsValue(nameMatchObj.srcName) && containsValue(nameMatchObj.trgName);
}


export ( )