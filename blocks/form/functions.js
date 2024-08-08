/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import {
  getOTP,
  otpValidation,
  getThisCard,
  prefillForm,
  getAddressDetails,
  pinCodeMaster,
  validateEmailID,
  currentAddressToggleHandler,
  aadharInit,
  checkMode,
  otpValHandler,
  customSetFocus,
  journeyResponseHandler,
  corpCreditCardContext,
  createJourneyId,
  validatePan,
  panAPISuccesHandler,
  executeInterfaceApi,
  ipaRequestApi,
  ipaSuccessHandler,
  sendAnalytics,
  aadharConsent123,
  resendOTP,
  fetchAuthCode,
  redirect,
  reloadPage,
  hideLoaderGif,
  executeInterfacePostRedirect,
  executeInterfaceApiFinal,
  executeInterfaceResponseHandler,
  documentUpload,
  setNameOnCard,
  firstLastNameValidation,
  validateLogin,
  sendErrorAnalytics,
  asyncAnalytics,
  idcomUrlSet,
  idcomRedirection,
  crmResponseHandler,
} from '../../common/functions.js';

import { initRestAPIDataSecurityServiceES6 } from '../../common/apiDataSecurity.js';

import { moveWizardView } from '../../common/formutils.js';
import { invokeJourneyDropOff, invokeJourneyDropOffByParam, invokeJourneyDropOffUpdate } from '../../common/journey-utils.js';
import { getSubmitBaseUrl } from './constant.js';

const { currentFormContext } = corpCreditCardContext;

/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */

function getFullName(firstname, lastname) {
  // eslint-disable-next-line no-param-reassign
  firstname = firstname == null ? '' : firstname;
  // eslint-disable-next-line no-param-reassign
  lastname = lastname == null ? '' : lastname;
  return firstname.concat(' ').concat(lastname);
}

/**
 * Creates a label element and appends it to a specified element in the DOM.
 * @param {string} elementSelector - The CSS selector for the target element.
 * @param {string} labelClass - The class to be applied to the created label element.
 * @returns {void}
 */
const createLabelInElement = (elementSelector, labelClass) => {
  /**
* The main element in the DOM where the form resides.
* @type {HTMLElement}
*/
  const mainEl = document.getElementsByTagName('main')[0];
  /**
* The form element containing the target element.
* @type {HTMLElement}
*/
  const formEl = mainEl.querySelector('form');
  /**
* The target element to which the label will be appended.
* @type {HTMLElement}
*/
  const element = formEl.querySelector(elementSelector);
  if (!element) {
    console.error(`Element with selector '${elementSelector}' not found.`);
    return;
  }

  /**
* The text content of the label element.
* @type {string}
*/
  const labelText = element.getElementsByTagName('label')[0].innerHTML;
  element.getElementsByTagName('label')[0].innerHTML = '';
  if (!labelText) {
    console.error(`No data-label attribute found for element with selector '${elementSelector}'.`);
    return;
  }

  /**
* The newly created label element.
* @type {HTMLLabelElement}
*/
  const labelElement = document.createElement('label');
  labelElement.classList.add(labelClass);
  labelElement.textContent = labelText;
  element.appendChild(labelElement);
};
/**
 * Decorates the stepper for CC yourDetails panel
 * @name decorateStepper Runs after yourDetails panel is initialized
 */
function decorateStepper() {
  const totalIndex = document.querySelector('.field-corporatecardwizardview.wizard').style.getPropertyValue('--wizard-step-count');
  const ccDetailsWizard = document.querySelector('.field-corporatecardwizardview.wizard ul');
  Array.from(ccDetailsWizard.children).forEach((child) => {
    if (child.tagName.toLowerCase() === 'li' && Number(child.getAttribute('data-index')) !== totalIndex - 1) {
      child?.classList?.add('stepper-style');
    }
  });
}

/**
 * On Wizard Init.
 * @name onWizardInit Runs on initialization of wizard
 */
function onWizardInit() {
  createLabelInElement('.field-permanentaddresstoggle', 'permanent-address-toggle__label');
  decorateStepper();
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * getFormContext - returns form context.
 * @returns {Promise} currentFormContext
 */
function getFormContext() {
  return currentFormContext;
}

/**
 * getWrappedFormContext - returns form context.
 * @returns {Promise} currentFormContext
 */
function getWrappedFormContext() {
  const formContext = {
    formContext: currentFormContext,
  };
  return formContext;
}

/**
* @name showElement
* @param {string} elementName
*/
function showElement(elementName) {
  const elm = document.querySelector(elementName);
  if (elm) {
    elm.style.display = 'block';
  }
}

/**
 *  invokes smart prefill
 * @param {scope} globals - The global object containing necessary globals form data.
 * @return {PROMISE}
 */
function invokeSmartPrefill(globals) {
  const smartPrefillFileAttachmentQname = '$form.corporateCardWizardView.yourDetailsPanel.smartPrefillAttachment';
  const filesMap = globals.functions.getFiles(smartPrefillFileAttachmentQname);
  // let attachmentData = null;
  let formJson = null;
  // filesMap[smartPrefillFileAttachmentQname].then((files) => {
  //   files.forEach((file) => {
  //     attachmentData = file.data;
  //   });
  // });

  const fileInput = document.querySelector('[name="smartPrefillAttachment"]');
  const file = fileInput.files[0];
  fetch(`${getSubmitBaseUrl()}/${window.location.pathname}/jcr:content/guideContainer.model.json`)
    .then((response) => response.json())
    .then((data) => {
      formJson = JSON.stringify(data);
    })
    .catch((error) => {
      console.error('Error fetching form JSON:', error);
    });

  // prepare the payload
  const formData = new FormData();
  formData.append('mode', 'document');
  formData.append('attachment', file);
  formData.append('formJson', formJson);

  // invoke the smart prefill API
  fetch('https://1o6jfrasi1.execute-api.ap-south-1.amazonaws.com/attachment', {
    method: 'POST',
    headers: {
      'User-Agent': 'Insomnia/2023.5.7-adobe',
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

// eslint-disable-next-line import/prefer-default-export
export {
  invokeSmartPrefill,
  getFullName,
  onWizardInit,
  getOTP,
  otpValidation,
  days,
  getThisCard,
  prefillForm,
  getAddressDetails,
  pinCodeMaster,
  validateEmailID,
  currentAddressToggleHandler,
  journeyResponseHandler,
  aadharInit,
  moveWizardView,
  checkMode,
  otpValHandler,
  customSetFocus,
  getFormContext,
  getWrappedFormContext,
  hideLoaderGif,
  createJourneyId,
  validatePan,
  panAPISuccesHandler,
  executeInterfaceApi,
  ipaRequestApi,
  ipaSuccessHandler,
  invokeJourneyDropOff,
  invokeJourneyDropOffByParam,
  invokeJourneyDropOffUpdate,
  sendAnalytics,
  aadharConsent123,
  resendOTP,
  showElement,
  fetchAuthCode,
  redirect,
  reloadPage,
  executeInterfacePostRedirect,
  executeInterfaceApiFinal,
  executeInterfaceResponseHandler,
  documentUpload,
  setNameOnCard,
  firstLastNameValidation,
  validateLogin,
  sendErrorAnalytics,
  asyncAnalytics,
  idcomUrlSet,
  idcomRedirection,
  initRestAPIDataSecurityServiceES6,
  crmResponseHandler,
};
