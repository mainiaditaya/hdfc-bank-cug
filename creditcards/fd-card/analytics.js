/* eslint-disable no-undef */
import { ANALYTICS_PAGE_LOAD_OBJECT } from '../../common/analyticsConstants.js';
import { CURRENT_FORM_CONTEXT } from '../../common/constants.js';
import { setAnalyticPageLoadProps, setAnalyticClickGenericProps } from '../../common/formanalytics.js';
import { createDeepCopyFromBlueprint, santizedFormDataWithContext } from '../../common/formutils.js';
import { ANALYTICS } from './constant.js';

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
  setAnalyticPageLoadProps(journeyState, formData, digitalData, ANALYTICS.formName);
  switch (CURRENT_FORM_CONTEXT.action) {
    default:
      // do nothing
  }
  if (window) {
    window.digitalData = digitalData || {};
  }
  _satellite.track('pageload');
}

/**
 *Creates digital data for otp click event.
 * @param {string} phone
 * @param {string} eventType
 * @param {string} linkType
 * @param {object} formData
 * @param {string} journeyState
 * @param {object} digitalData
 */
const sendSubmitClickEvent = (eventType, formData, journeyState, digitalData) => {
  formData.etbFlowSelected = 'on';
  setAnalyticClickGenericProps(ANALYTICS.event[eventType].name, ANALYTICS.event[eventType].type, formData, journeyState, digitalData, ANALYTICS.formName);
  digitalData.form.name = ANALYTICS.formName;
  // const phone = formData?.login?.registeredMobileNumber;
  digitalData.page.pageInfo.pageName = PAGE_NAME.ccc[eventType];
  switch (eventType) {
    case 'getOtp':
      sendPageloadEvent(ANALYTICS.event.submitOtp.journeyState, formData, ANALYTICS.event.submitOtp.pageName);
      break;
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
  sendSubmitClickEvent(eventType, formData, journeyState, digitalData);
};

/**
* sendAnalytics
* @param {string} eventType
* @param {string} pageName
* @param {string} payload
* @param {string} journeyState
* @param {object} globals
*/
const sendAnalytics = (eventType, pageName, payload, journeyState, globals) => {
  const formData = santizedFormDataWithContext(globals, CURRENT_FORM_CONTEXT);
  if (eventType.toLowerCase() === 'page load') {
    sendPageloadEvent(journeyState, formData, pageName);
  } else {
    sendAnalyticsClickEvent(eventType, payload, journeyState, formData);
  }
};

export default sendAnalytics;
