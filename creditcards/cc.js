/* eslint-disable no-tabs */
/* eslint no-console: ["error", { allow: ["warn", "error", "debug"] }] */
import openModal from '../blocks/modal/modal.js';

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
    console.debug(`Element with selector '${elementSelector}' not found.`);
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
  createLabelInElement('.field-currentaddresstoggle', 'current-address-toggle__label');
  createLabelInElement('.field-ckyctoggle', 'ckyctoggle__label');
  decorateStepper();
}

/* startCode for creating Modal */
/**
 * Function to link a trigger element with a modal opening functionality.
 * @param {Object} config - Configuration object for the modal.
 * @param {HTMLElement} config.triggerElement - The element triggering the modal.
 * @param {HTMLElement} config.content - The content to display in the modal.
 * @param {String} [config.actionWrapClass] - Wrapper class containing all the buttons.
 * @param {Boolean} [config.reqConsentAgree=false] - Flag indicating whether consent agreement is required.
 * @param {Function} [config.updateUI] - Function for DOM manipulation upon receiving data.
 */

const linkModalFunction = (config) => {
  config?.triggerElement?.addEventListener('click', async (e) => {
    const { checked, type } = e.target;
    const checkBoxElement = (type === 'checkbox') && checked;
    const otherElement = true;
    const elementType = (type === 'checkbox') ? checkBoxElement : otherElement;
    if (elementType) {
      e.preventDefault();
      await openModal(config);
      config?.content?.addEventListener('modalTriggerValue', (event) => {
        const receivedData = event.detail;
        if (config?.updateUI) {
          config?.updateUI(receivedData);
        }
      });
    }
  });
};
/* endCode for creating Modal */

/* modalLinking  in pages  */
// 1.consent-2 checkbox - modal
const consent2Config = {
  // config to create modal for consent-2
  triggerElement: document.getElementsByName('checkboxConsent2Label')?.[0], // trigger element for calling modalFunction
  content: document.getElementsByName('consentPanel2')?.[0], // content to display in modal
  actionWrapClass: 'button-wrapper', // wrapper class containing all the buttons
  reqConsentAgree: false, // Indicates if consent agreement is needed; shows close icon if not.
  /**
	 * Updates the UI based on received data.
	 * @param {Object} receivedData - Data received after the modal button trigger,contains name of the btn triggered which is used to update the UI.
	 */
  updateUI(receivedData) {
    if (receivedData?.checkboxConsent2CTA) {
      // iAgreeConsent2- name of the I agree btn.
      this.triggerElement.checked = true;
      this.triggerElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (receivedData?.closeIcon) {
      // closeIcon - name of the Close x btn
      this.triggerElement.checked = false;
      this.triggerElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};
linkModalFunction(consent2Config);
// 2.consent-2 otherProduct-text - modal
const consent2OtherProduct = document?.querySelector('.field-checkboxconsent2label')?.querySelector('b');
const linkClass = 'link';
consent2OtherProduct?.classList.add(linkClass);
const consent2OtherProductTxtConfig = {
  // config to create modal for consent-2
  triggerElement: consent2OtherProduct, // trigger element for calling modalFunction
  content: consent2Config?.content, // content to display in modal
  actionWrapClass: 'button-wrapper', // wrapper class containing all the buttons
  reqConsentAgree: false, // Indicates if consent agreement is needed; shows close icon if not.
  /**
	 * Updates the UI based on received data.
	 * @param {Object} receivedData - Data received after the modal button trigger,contains name of the btn triggered which is used to update the UI.
	 */
  updateUI(receivedData) {
    const checkBox = consent2Config?.triggerElement;
    if (receivedData?.checkboxConsent2CTA) {
      // iAgreeConsent2- name of the I agree btn.
      checkBox.checked = true;
    }
    if (receivedData?.closeIcon) {
      // closeIcon - name of the Close x btn
      checkBox.checked = false;
    }
  },
};
linkModalFunction(consent2OtherProductTxtConfig);

// 3.conset-1 checbox - modal
const consent1Config = {
  // config to create modal for consent-1
  triggerElement: document.getElementsByName('checkboxConsent1Label')?.[0], // trigger element for calling modalFunction
  content: document.getElementsByName('consentPanel1')?.[0], // content to display in modal
  actionWrapClass: 'button-wrapper', // wrapper class containing all the buttons
  reqConsentAgree: true, // Indicates if consent agreement is needed; shows close icon if not.
  /**
	 * Updates the UI based on received data.
	 * @param {Object} receivedData - Data received after the modal button trigger,contains name of the btn triggered which is used to update the UI.
	 */
  updateUI(receivedData) {
    if (receivedData?.checkboxConsent1CTA) {
      // iAgreeConsent2- name of the I agree btn.
      this.triggerElement.checked = true;
      this.triggerElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (receivedData?.closeIcon) {
      // closeIcon - name of the Close x btn
      this.triggerElement.checked = false;
      this.triggerElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};
linkModalFunction(consent1Config);

// 4.consent-1 requestProduct-text - modal
const consent1RequestProduct = document?.querySelector('.field-checkboxconsent1label')?.querySelector('b');
consent1RequestProduct?.classList.add(linkClass);
const consent2RequestProductTxtConfig = {
  // config to create modal for consent-2
  triggerElement: consent1RequestProduct, // trigger element for calling modalFunction
  content: consent1Config?.content, // content to display in modal
  actionWrapClass: 'button-wrapper', // wrapper class containing all the buttons
  reqConsentAgree: true, // Indicates if consent agreement is needed; shows close icon if not.
  /**
	 * Updates the UI based on received data.
	 * @param {Object} receivedData - Data received after the modal button trigger,contains name of the btn triggered which is used to update the UI.
	 */
  updateUI(receivedData) {
    const checkBox = consent1Config?.triggerElement;
    if (receivedData?.checkboxConsent1CTA) {
      // iAgreeConsent2- name of the I agree btn.
      checkBox.checked = true;
    }
    if (receivedData?.closeIcon) {
      // closeIcon - name of the Close x btn
      checkBox.checked = false;
    }
  },
};
linkModalFunction(consent2RequestProductTxtConfig);

// 5.wizard screen getCard-viewAll button - modal
const viewAllBtnPannelConfig = {
  // linkModal for corporateCardWizard pannel view all in getThisCard screen.
  triggerElement: document.getElementsByName('viewAllCardBenefits')?.[0],
  content: document.getElementsByName('viewAllCardBenefitsPanel')?.[0],
  actionWrapClass: 'button-wrapper',
  reqConsentAgree: true,
};
linkModalFunction(viewAllBtnPannelConfig);

const displayLoader = (loadingText) => {
  const bodyContainer = document?.querySelector('.appear');
  bodyContainer?.classList?.add('preloader');
  if (loadingText) {
    bodyContainer.setAttribute('loader-text', loadingText);
  }
};

const hideLoaderGif = () => {
  const bodyContainer = document?.querySelector('.appear');
  bodyContainer?.classList?.remove('preloader');
  if (bodyContainer.hasAttribute('loader-text')) {
    bodyContainer.removeAttribute('loader-text');
  }
};

const errorPannelMethod = () => {
  const errorPannel = document.getElementsByName('errorResultPanel')?.[0];
  const resultPanel = document.getElementsByName('resultPanel')?.[0];
  resultPanel.setAttribute('data-visible', true);
  errorPannel.setAttribute('data-visible', true);
};

const setArnNumberInResult = (arnNumRef) => {
  const nameOfArnRefPanel = 'arnRefNumPanel';
  const classNamefieldArnNo = '.field-newarnnumber';
  const arnRefNumPanel = document.querySelector(`[name= ${nameOfArnRefPanel}]`);
  const arnNumberElement = arnRefNumPanel.querySelector(classNamefieldArnNo);
  if (arnNumberElement) {
    // Manipulate the content of the <p> tag inside '.field-newarnnumber'
    arnNumberElement.querySelector('p').textContent = arnNumRef;
  }
};

const successPannelMethod = (data) => {
  const {
    executeInterfaceReqObj, aadharOtpValData, finalDapRequest, finalDapResponse,
  } = data;
  const journeyName = executeInterfaceReqObj?.requestString?.journeyFlag;
  const addressEditFlag = executeInterfaceReqObj?.requestString?.addressEditFlag;
  // eslint-disable-next-line no-unused-vars
  const { applicationNumber, vkycUrl } = finalDapResponse;
  // eslint-disable-next-line no-unused-vars
  const { result: { mobileValid } } = aadharOtpValData;
  const resultPanel = document.getElementsByName('resultPanel')?.[0];
  const successPanel = document.getElementsByName('successResultPanel')?.[0];
  resultPanel.setAttribute('data-visible', true);
  successPanel.setAttribute('data-visible', true);
  setArnNumberInResult(applicationNumber);

  const vkycProceedButton = document.querySelector('.field-vkycproceedbutton ');
  const offerLink = document.querySelector('.field-offerslink');
  const vkycConfirmText = document.querySelector('.field-vkycconfirmationtext');
  const filler4Val = finalDapRequest?.requestString?.VKYCConsent?.split(/[0-9]/g)?.[0];
  const mobileMatch = !(filler4Val === 'NVKYC');
  const kycStatus = (finalDapRequest.requestString.biometricStatus);
  const vkycCameraConfirmation = document.querySelector(`[name= ${'vkycCameraConfirmation'}]`);

  if (journeyName === 'ETB') {
    // const mobileMatch =  !(mobileValid === 'n');  // (mobileValid === 'n') - unMatched - this should be the condition which has to be finalDap - need to verify.
    if (addressEditFlag === 'N') {
      vkycProceedButton.setAttribute('data-visible', false);
      vkycConfirmText.setAttribute('data-visible', false);
      offerLink.setAttribute('data-visible', true);
    } else if (kycStatus === 'OVD') {
      vkycProceedButton.setAttribute('data-visible', false);
      vkycConfirmText.setAttribute('data-visible', true);
      offerLink.setAttribute('data-visible', false); // Adjusted assumption for offerLink
    } else if (mobileMatch && kycStatus === 'aadhaar' && addressEditFlag === 'Y') {
      vkycProceedButton.setAttribute('data-visible', false);
      vkycConfirmText.setAttribute('data-visible', false);
      offerLink.setAttribute('data-visible', true);
    } else {
      vkycProceedButton.setAttribute('data-visible', true);
      vkycConfirmText.setAttribute('data-visible', false);
      offerLink.setAttribute('data-visible', false);
    }
  }
  if (journeyName === 'NTB' && (kycStatus === 'aadhaar')) {
    vkycCameraConfirmation.setAttribute('data-visible', true);
    vkycProceedButton.setAttribute('data-visible', true);
    // vkycProceedButton.addEventListener('click', (e) => {
    //   window.location.href = vkycUrl;
    // });
  }
};

// post-redirect-aadhar-or-idcom
const searchParam = new URLSearchParams(window.location.search);
const visitTypeParam = searchParam.get('visitType');
const authModeParam = searchParam.get('authmode');
const journeyId = searchParam.get('journeyId');
const aadharRedirect = visitTypeParam && (visitTypeParam === 'EKYC_AUTH');
const idComRedirect = authModeParam && (authModeParam === 'DebitCard');
/**
 * Redirects the user to different panels based on conditions.
 * If `aadhar` is true, navigates from 'corporateCardWizardView' to 'confirmAndSubmitPanel'
 * If `idCom` is true, initiates a journey drop-off process and handles the response which handles after all the final dap api call.
 * @param {boolean} aadhar - Indicates whether Aadhar redirection is triggered.
 * @param {boolean} idCom - Indicates whether ID com redirection is triggered.
 * @returns {void}
 */
const pageRedirected = (aadhar, idCom) => {
  if (aadhar) {
    debugger;
    const navigateFrom = document.getElementsByName('corporateCardWizardView')?.[0];
    const current = navigateFrom?.querySelector('.current-wizard-step');
    const currentMenuItem = navigateFrom?.querySelector('.wizard-menu-active-item');
    const navigateTo = document.getElementsByName('confirmAndSubmitPanel')?.[0];
    current?.classList?.remove('current-wizard-step');
    navigateTo?.classList?.add('current-wizard-step');
    // add/remove active class from menu item
    const navigateToMenuItem = navigateFrom?.querySelector(`li[data-index="${navigateTo?.dataset?.index}"]`);
    currentMenuItem?.classList?.remove('wizard-menu-active-item');
    navigateToMenuItem?.classList?.add('wizard-menu-active-item');
    const event = new CustomEvent('wizard:navigate', {
      detail: {
        prevStep: { id: current?.id, index: parseInt(current?.dataset?.index || 0, 10) },
        currStep: { id: navigateTo?.id, index: parseInt(navigateTo?.dataset?.index || 0, 10) },
      },
      bubbles: false,
    });
    navigateFrom?.dispatchEvent(event);
  }
  if (idCom) {
    debugger;
    displayLoader();
    const invokeJourneyDropOffByParam = async (mobileNumber, leadProfileId, journeyID) => {
      const journeyJSONObj = {
        RequestPayload: {
          leadProfile: {
          },
          journeyInfo: {
            journeyID,
          },
        },
      };
      const url = 'https://applyonlinedev.hdfcbank.com/content/hdfc_commonforms/api/journeydropoffparam.json';
      const method = 'POST';
      return fetch(url, {
        method,
        body: JSON.stringify(journeyJSONObj),
        mode: 'cors',
        headers: {
          'Content-type': 'text/plain',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json()).then((res) => {
          debugger;
          hideLoaderGif();
          const data = res;
          const journeyDropOffParamLast = data.formData.journeyStateInfo[data.formData.journeyStateInfo.length - 1];
          const checkFinalDapSuccess = (journeyDropOffParamLast.state === 'FINAL_DAP_SUCCESS');
          if (checkFinalDapSuccess) {
            const {
              currentFormContext: {
                executeInterfaceReqObj, finalDapRequest, finalDapResponse,
              }, aadhaar_otp_val_data: aadharOtpValData,
            } = JSON.parse(journeyDropOffParamLast.stateInfo);
            successPannelMethod({
              executeInterfaceReqObj, aadharOtpValData, finalDapRequest, finalDapResponse,
            });

            // const vkycProceedButton = document.getElementsByName('vkycProceedButton')?.[0];
            // vkycProceedButton.addEventListener('click', (e) => {
            //   window.location.href = VKYC_URL;
            // });
          } else {
            // errror
            const err = 'badResponse';
            throw err;
          }
        }).catch((e) => {
          hideLoaderGif();
          errorPannelMethod();
        });
    };
    setTimeout(() => {
      invokeJourneyDropOffByParam('', '', journeyId);
    }, 20000);
  }
};
pageRedirected(aadharRedirect, idComRedirect);

/**
 * Changes the language of the Aadhar content to the specified language.
 * @param {Object} content - The content configuration for Aadhar.
 * @param {string} defaultLang - The language to show us default.
 */
// select dropdow-aadhar
const aadharLangChange = (adharContentDom, defaultLang) => {
  const selectOp = adharContentDom.querySelector(`[name= ${'selectLanguage'}]`);
  const findFieldSet = adharContentDom?.querySelectorAll('fieldset');
  const selectedClass = 'selected-language';
  const defaultOptionClass = `field-aadharconsent-${defaultLang?.toLowerCase()}`;
  const applySelected = (fieldNode, optionClass, nameClass) => {
    fieldNode?.forEach((element) => {
      if (element?.classList?.contains(optionClass)) {
        element.style.display = 'block';
        element?.classList.add(nameClass);
      } else {
        element.style.display = 'none';
        element?.classList.remove(nameClass);
      }
    });
  };
  applySelected(findFieldSet, defaultOptionClass, selectedClass);
  selectOp.value = defaultLang;
  selectOp?.addEventListener('change', (e) => {
    e.preventDefault();
    const { value: valueSelected } = e.target;
    selectOp.value = valueSelected;
    const optionClass = `field-aadharconsent-${valueSelected?.toLowerCase()}`;
    applySelected(findFieldSet, optionClass, selectedClass);
  });
};

/**
 * Validates the date of birth field to ensure the age is between 18 and 70.
 * @param {string} inputName - The name of the calendar input field.
  */
const validateDob = (inputName) => {
  const calendarEl = document.querySelector(`[name= ${inputName}]`);
  const minAge = 18;
  const maxAge = 70;
  const calendarElParent = calendarEl?.parentElement;
  const dobDefFieldDesc = calendarElParent.querySelector('.field-description');
  const radioDob = document.getElementById('pandobselection');
  const dobErrorText = `Age should be between ${minAge} to ${maxAge}`;
  dobDefFieldDesc.style.display = 'none';
  calendarEl?.addEventListener('blur', async (e) => {
    const ipDobValue = e?.target?.value;
    if (ipDobValue) {
      const utils = await import('../common/formutils.js');
      const ageValid = utils.ageValidator(minAge, maxAge, ipDobValue);
      if (!ageValid) {
        utils.makeFieldInvalid(inputName, dobErrorText);
        dobDefFieldDesc.style.display = 'block';
      }
    }
  });
  calendarEl?.addEventListener('input', async () => {
    dobDefFieldDesc.style.display = 'none';
  });
  if (!(inputName === 'dateOfBirth')) return;
  radioDob?.addEventListener('click', () => {
    dobDefFieldDesc.style.display = 'none';
    calendarEl?.setAttribute('type', 'date');
    calendarEl?.setAttribute('edit-value', '');
    calendarEl?.setAttribute('display-value', '');
  });
};

/**
 * Validates a date field, disables future dates, and optionally validates age based on ageValidate flag.
 * @param {string} inputName - The name of the input field.
 * @param {boolean} ageValidate - Flag indicating whether to validate age (minAge:18, maxAge:70).
 */
const dateFieldValidate = (inputName, ageValidate) => {
  const calendarEl = document.querySelector(`[name= ${inputName}]`);
  calendarEl?.setAttribute('max', new Date()?.toISOString()?.split('T')?.[0]);
  if (ageValidate) {
    validateDob(inputName);
  }
};
dateFieldValidate('employedFrom');
dateFieldValidate('dateOfBirth', true);
dateFieldValidate('dobPersonalDetails', true);

/**
 *  Validates and restricts input on the OTP number field to allow only numeric characters.
 *  Hides the incorrect OTP text message when the user starts typing in the OTP input field.
 */
const otpFieldValidate = () => {
  const otpNumFormName = 'otpNumber';// constantName-otpFieldValidateName
  const otpNumber = document.querySelector(`[name= ${otpNumFormName}]`);
  const incorectOtp = document.querySelector('.field-incorrectotptext');
  otpNumber?.addEventListener('input', (e) => {
    if (e.target.value) {
      const input = e.target;
      input.value = input.value.replace(/\D/g, ''); // Replace non-numeric characters with an empty string
      incorectOtp.style.display = 'none';
    }
  });
};
otpFieldValidate();

/**
 * Validates and sanitizes input for personal names.
 * This function binds an 'input' event listener to the input field identified by the given name attribute.
 * It filters out non-numeric characters,spaces and special characters from the input value.
 *
 * @param {string} inputName - The name attribute value of the input field to be validated.
 * @returns {void}
 */
const validateNamesOfYourDetail = (inputName) => {
  const fName = document.querySelector(`[name= ${inputName}]`);
  fName.addEventListener('input', (e) => {
    const input = e.target;
    input.value = input.value.replace(/(?![A-Z])[`!@#$%^&*_\=\[\]{};':"\\|,.<>\/?~0-9()+-_ ]/g, ''); // Replace non-numeric characters with an empty string
  });
};

['firstName', 'middleName', 'lastName'].forEach((ipName) => validateNamesOfYourDetail(ipName));

export {
  decorateStepper,
  onWizardInit,
  aadharLangChange,
};
