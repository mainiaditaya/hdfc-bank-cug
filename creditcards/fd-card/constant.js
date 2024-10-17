// declare CONSTANTS for (fd) fd only.

const JOURNEY_NAME = 'EXISTING_CC_BASED_FDLIEN_JOURNEY';

const AGE_LIMIT = {
  min: 18,
  max: 80,
};

// const REGEX_PAN = /^[a-zA-Z]{3}[Pp][a-zA-Z][0-9]{4}[a-zA-Z]{1}/g;
const REGEX_PAN = /^[A-Za-z]{5}\d{4}[A-Za-z]$/g; // matches Pan regex without considering the 'p' char in P

const ERROR_MSG = {
  panLabel: 'PAN',
  dobLabel: 'DOB',
  panError: 'Please enter a valid PAN Number',
  mobileError: 'Enter valid mobile number',
  ageLimit: `Age should be between ${AGE_LIMIT.min} to ${AGE_LIMIT.max}`,
  invalidPan: 'Maximum PAN retry attempts exceeded.',
  matchingAddressLine: 'Address Line 1 and Address Line 2 cannot be same',
  shorAddressNote: 'Note: Address is too short, please enter valid address.',
  invalidPinNote: 'Note: Pincode is not matching with the city in address as per the bank records, please provide correct address.',
  sessionExpired: 'Session expired',
  branchVisitWithRefNum: 'Visit your nearest dealership or HDFC Bank branch with reference number:',
};

const FD_ENDPOINTS = {
  otpGen: '/content/hdfc_hafcards/api/customeridentificationotpgen.json',
  otpVal: '/content/hdfc_hafcards/api/otpvalidationandcardsinquiry.json',
  journeyDropOff: '/content/hdfc_commonforms/api/journeydropoff.json',
  emailId: '/content/hdfc_commonforms/api/emailid.json',
  customeraccountdetailsdto: '/content/hdfc_hafcards/api/hdfccardscustomeraccountdetailsdto.json',
  masterchannel: 'https://applyonlineuat01.hdfcbank.com/content/hdfc_commonforms/api/mdm.CREDIT.CHANNEL_MASTER.CHANNELS.json',
  dsamaster: 'https://applyonlineuat01.hdfcbank.com/content/hdfc_commonforms/api/mdm.CREDIT.DSA_MASTER.DSA_CODE-',
  branchMaster: 'https://applyonlineuat01.hdfcbank.com/content/hdfc_ccforms/api/branchcode.',
  executeInterface: '/content/hdfc_hafcards/api/hdfccardsexecuteinterface.json',
  ipa: '/content/hdfc_hafcards/api/hdfccardsipa.json',
  hdfccardsgetrefidfdcc: '/content/hdfc_hafcards/api/hdfccardsgetrefidfdcc.json',
  hdfccardsgetfdeligibilitystatus: '/content/hdfc_hafcards/api/hdfccardsgetfdeligibilitystatus.json',
  hdfccardsexecutefinaldap: '/content/hdfc_hafcards/api/hdfccardsexecutefinaldap.json',
};

const OTP_TIMER = 30;
const MODE = 'dev';
// const MODE = 'prod';
const MAX_OTP_RESEND_COUNT = 3;
const MAXIMUM_CREDIT_AMOUNT = 800000;
const NAME_ON_CARD_LENGTH = 19;
const MAX_ADDRESS_LENGTH = 90;
const MIN_ADDRESS_LENGTH = 30;

const IDCOM = {
  productCode: 'CCPREISS',
  scope: {
    addressNotChanged: 'AACC_FDCC',
    addressChanged: 'ADOBE_FDCC',
  },
  response: {
    sessionExpired: {
      errorCode: '9997',
      errorMsg: 'Session expired',
    },
  },
};

const DOM_ELEMENT = {
  selectKyc: {
    aadharModalContent: 'aadharConsentPopup',
    modalBtnWrapper: 'button-wrapper',
    defaultLanguage: 'English',
  },
};

const ANALYTICS = {
  formName: 'Fixed Deposit Lien Credit Card',
  JOURNEY_NAME: 'FD_Lien_CC_Journey',
  event: {
    formLoad: {
      type: 'page load',
      name: 'Form Load',
      pageName: 'Home page',
      journeyState: 'CRM_LEAD_SUCCESS',
    },
    getOtp: {
      type: 'click',
      name: 'otp click',
      pageName: 'Identify Yourself',
      journeyState: 'CUSTOMER_IDENTITY_RESOLVED',
      nextPage: 'submitOtp',
    },
    submitOtp: {
      type: 'click',
      name: 'submit otp',
      pageName: 'Verify with OTP',
      journeyState: 'CUSTOMER_IDENTITY_RESOLVED',
      nextPage: 'selectCustomerId',
    },
    selectCustomerId: {
      type: 'click',
      name: 'Select Customer ID',
      pageName: 'Select Customer ID',
      journeyState: '',
      nextPage: 'selectFD',
    },
    selectFd: {
      type: 'click',
      name: 'select fd',
      pageName: 'Select FD',
      journeyState: 'CUSTOMER_LEAD_QUALIFIED',
      nextPage: 'reviewDetails',
    },
    reviewDetailsBack: {
      type: 'click',
      name: 'review details back',
      pageName: 'Review Details',
      journeyState: 'CUSTOMER_LEAD_QUALIFIED',
      nextPage: 'selectFD',
    },
    reviewDetails: {
      type: 'click',
      name: 'review details',
      pageName: 'Review Details',
      journeyState: '',
      nextPage: 'selectCard',
    },
    selectCard: {
      type: 'click',
      name: 'select card',
      pageName: 'Select Card',
      journeyState: '',
      nextPage: 'selectCard',
    },
  },
};

const GENDER_MAP = {
  Male: '1', Female: '2', Others: '3', 'Third Gender': '3',
};
const OCCUPATION_MAP = {
  salaried: '1',
  'self employed': '2',
  student: '3',
  housewife: '4',
  retired: '5',
};
const ALLOWED_CHARACTERS = '/ -,';

const EMPLOYEE_MAP = {
  1: 'Employee',
  2: 'Proprietor',
  3: '',
  4: '',
  5: '',
};

export {
  JOURNEY_NAME,
  ERROR_MSG,
  AGE_LIMIT,
  REGEX_PAN,
  OTP_TIMER,
  FD_ENDPOINTS,
  MAX_OTP_RESEND_COUNT,
  MODE,
  MAXIMUM_CREDIT_AMOUNT,
  NAME_ON_CARD_LENGTH,
  MAX_ADDRESS_LENGTH,
  MIN_ADDRESS_LENGTH,
  DOM_ELEMENT,
  IDCOM,
  ANALYTICS,
  GENDER_MAP,
  OCCUPATION_MAP,
  ALLOWED_CHARACTERS,
  EMPLOYEE_MAP,
};
