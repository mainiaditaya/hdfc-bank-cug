/* eslint-disable no-undef */
import { ANALYTICS_PAGE_LOAD_OBJECT } from '../../common/analyticsConstants.js';
import { CURRENT_FORM_CONTEXT } from '../../common/constants.js';
import { setAnalyticPageLoadProps, setAnalyticClickGenericProps } from '../../common/formanalytics.js';
import { createDeepCopyFromBlueprint, santizedFormDataWithContext } from '../../common/formutils.js';
import { FORM_NAME } from './constant.js';

/**
 * Sends analytics event on page load.
 * @name sendPageloadEvent
 * @param {string} journeyState.
 * @param {object} formData.
 * @param {string} pageName.
 */
function sendPageloadEvent(journeyState, formData, pageName) {
  const digitalData = createDeepCopyFromBlueprint(ANALYTICS_PAGE_LOAD_OBJECT);
  digitalData.page.pageInfo.pageName = pageName;
  setAnalyticPageLoadProps(journeyState, formData, digitalData, FORM_NAME);
  switch (CURRENT_FORM_CONTEXT.action) {
    default:
      // do nothing
  }
  if (window) {
    window.digitalData = digitalData || {};
  }
  _satellite.track('pageload');
}

const populateResponse = (payload, eventType, digitalData) => {
  console.log(digitalData);
  switch (eventType) {
    default:
    // do nothing
  }
};

/**
 *Creates digital data for otp click event.
 * @param {string} phone
 * @param {string} validationType
 * @param {string} eventType
 * @param {object} formContext
 * @param {object} digitalData
 */
const sendSubmitClickEvent = (phone, eventType, linkType, formData, journeyState, digitalData) => {
  setAnalyticClickGenericProps(eventType, linkType, formData, journeyState, digitalData, FORM_NAME);
  digitalData.page.pageInfo.pageName = PAGE_NAME.ccc[eventType];
  switch (eventType) {
    default:
      // do nothing
  }
};

/**
 * Send analytics events.
 * @param {string} eventType
 * @param {object} payload
 * @param {string} journeyState
 * @param {object} formData
 * @param {object} currentFormContext
 */
const sendAnalyticsClickEvent = (eventType, payload, journeyState, formData) => {
  const digitalData = createDeepCopyFromBlueprint(ANALYTICS_CLICK_OBJECT);
  const attributes = data[eventType];
  populateResponse(payload, eventType, digitalData);
  sendSubmitClickEvent(formData?.login?.registeredMobileNumber, eventType, attributes?.linkType, formData, journeyState, digitalData);
};

/**
* sendAnalytics
* @param {string} eventType
* @param {string} eventName
* @param {string} pageName
* @param {string} payload
* @param {string} journeyState
* @param {object} globals
*/
const sendAnalytics = (eventType, eventName, pageName, payload, journeyState, globals) => {
  const formData = santizedFormDataWithContext(globals);
  if (eventName.toLowerCase() === 'page load') {
    sendPageloadEvent(journeyState, formData, pageName);
  } else {
    sendAnalyticsClickEvent(eventType, payload, journeyState, formData);
  }
};

export default sendAnalytics;
