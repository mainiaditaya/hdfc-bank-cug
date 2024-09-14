import {
  validateLogin,
  otpTimer,
  maskedMobNum,
  getOTP,
  otpValidation,
  resendOTP,
  customSetFocus,
  reloadPage,
  pincodeChangeHandler,
} from './fdlien-functions.js';

import {
  invokeJourneyDropOff,
  fdWizardSwitch,
  journeyResponseHandler,
  invokeJourneyDropOffUpdate,
} from './fd-journey-util.js';

import {
  bindCustomerDetails,
  channelChangeHandler,
  validateEmailID,
  dsaCodeHandler,
  branchCodeHandler,
  dobChangeHandler,
  fathersNameChangeHandler,
} from './customerdetails.js';

// import { getOTP, otpValidation } from '../../common/functions.js'; // improvisation required to make it generic, till then using the journey specific function getotp,otpVal 👆
import {
  redirect,
  validatePan,
  idcomRedirection,
} from '../../common/functions.js';

import createJourneyId from '../../common/journey-utils.js';

import {
  docUploadClickHandler,
  fileUploadUIHandler,
} from './docuploadutil.js';

import {
  addGaps,
  addMobileValidation,
  validateOtpInput,
  updateElementAttr,
  changeCheckboxToToggle,
} from './fd-dom-functions.js';

import {
  fetchCustomerId,
  customerIdSuccessHandler,
  customerIdClickHandler,
  fetchReferenceId,
} from './customeridutil.js';

import {
  customerIdProceedHandler,
  fdSelectHandler,
  resetFDSelection,
  selectAllFdClickHandler,
} from './fddetailsutil.js';

import executeInterface from './executeinterfaceutil.js';

import {
  confirmCardClickHandler,
  knowMoreCardClickHandler,
  selectCardBackClickHandler,
  cardSelectHandler,
  popupBackClickHandler,
} from './confirmcardutil.js';

import {
  ipa,
  ipaSuccessHandler,
} from './ipautil.js';

import { idcomm, idcomSuccessHandler } from './idcomutil.js';

import {
  kycProceedClickHandler,
  addressDeclarationProceedHandler,
} from './kycUtil.js';

export {
  getOTP,
  otpTimer,
  otpValidation,
  validateLogin,
  createJourneyId,
  maskedMobNum,
  addGaps,
  addMobileValidation,
  redirect,
  resendOTP,
  customSetFocus,
  reloadPage,
  validateOtpInput,
  invokeJourneyDropOff,
  updateElementAttr,
  fdWizardSwitch,
  changeCheckboxToToggle,
  fetchCustomerId,
  customerIdSuccessHandler,
  customerIdClickHandler,
  bindCustomerDetails,
  fdSelectHandler,
  customerIdProceedHandler,
  selectAllFdClickHandler,
  resetFDSelection,
  validateEmailID,
  pincodeChangeHandler,
  channelChangeHandler,
  validatePan,
  dsaCodeHandler,
  branchCodeHandler,
  dobChangeHandler,
  fathersNameChangeHandler,
  executeInterface,
  fetchReferenceId,
  confirmCardClickHandler,
  ipa,
  ipaSuccessHandler,
  knowMoreCardClickHandler,
  selectCardBackClickHandler,
  cardSelectHandler,
  popupBackClickHandler,
  docUploadClickHandler,
  fileUploadUIHandler,
  journeyResponseHandler,
  invokeJourneyDropOffUpdate,
  idcomRedirection,
  idcomm,
  idcomSuccessHandler,
  kycProceedClickHandler,
  addressDeclarationProceedHandler,
};
