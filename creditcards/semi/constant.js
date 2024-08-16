// declare CONSTANTS for (fd) fd only.

const JOURNEY_NAME = 'SMART_EMI_JOURNEY';
const PRO_CODE = '009';

const CHANNEL = 'ADOBE_WEB';

const ERROR_MSG = {
  mobileError: 'Enter valid mobile number',
};

const FORM_RUNTIME = {};

const SEMI_ENDPOINTS = {
  otpGen: '/content/hdfc_ccforms/api/validatecardotpgen.json',
  otpVal: '/content/hdfc_ccforms/api/eligibilitycheck.json',
  ccBilled: '/content/hdfc_ccforms/api/ccbilledtransaction.json',
  ccUnbilled: '/content/hdfc_ccforms/api/ccunbilled.json',
};

const OTP_TIMER = 30;
const MAX_OTP_RESEND_COUNT = 3;
const CURRENT_FORM_CONTEXT = {};

const DOM_ELEMENT = {
  semiWizard: 'aem_semiWizard',
  chooseTransaction: 'aem_chooseTransactions',
};

const MISC = {
  rupeesUnicode: '\u20B9',
};

export {
  JOURNEY_NAME,
  ERROR_MSG,
  OTP_TIMER,
  SEMI_ENDPOINTS,
  MAX_OTP_RESEND_COUNT,
  CURRENT_FORM_CONTEXT,
  CHANNEL,
  FORM_RUNTIME,
  PRO_CODE,
  DOM_ELEMENT,
  MISC,
};
