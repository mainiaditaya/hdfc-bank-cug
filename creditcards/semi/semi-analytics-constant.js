const ANALYTICS_EVENT_NAME = {
  'page load': 'page load',
  'otp click': 'otp click',
  'submit otp': 'submit otp',
  'transaction view': 'transaction view',
  'tenure page': 'tenure page',
};

const ANALYTICS_JOURNEY_STATE = {
  'page load': 'CUSTOMER_IDENTITY_ACQUIRED',
  'otp click': 'CUSTOMER_IDENTITY_RESOLVED',
  'submit otp': 'CUSTOMER_IDENTITY_RESOLVED',
  'transaction view': '',
  'tenure page': 'CUSTOMER_PREEXECUTION_SUCCESS',
  'confirm tenure': '',
};

const ANALYTICS_PAGE_NAME = {
  'page load': 'Step 1 - Identify Yourself',
  'otp click': 'Step 1 - Identify Yourself',
  'submit otp': 'Step 2 - Verify with OTP',
  'transaction view': 'Step 3 - View Spends - Select Transactions',
  'tenure page': 'Step 3 - View Spends - Select Tenure',
  'confirm tenure': 'Step 4 - Confirm with OTP',
  'Error Page': 'Error Page',
};

const ANALYTICS_LINK_BTN = {
  'otp click': {
    linkType: 'button',
    StepName: 'Step 1 - Identify Yourself',
    linkPosition: 'Form',
    pageName: ANALYTICS_PAGE_NAME['otp click'],
  },
  'submit otp': {
    linkType: 'button',
    StepName: 'Step 2 - Verify with OTP',
    linkPosition: 'Form',
    pageName: ANALYTICS_PAGE_NAME['submit otp'],
  },
  'transaction view': {
    linkType: 'button',
    StepName: 'Step 3 - View Spends - Select Transactions',
    linkPosition: 'Form',
    pageName: ANALYTICS_PAGE_NAME['transaction view'],
  },
  'tenure page': {
    linkType: 'button',
    StepName: 'Step 3 - View Spends - Select Tenure',
    linkPosition: 'Form',
    pageName: ANALYTICS_PAGE_NAME['tenure page'],
  },
};

const ANALYTICS_OBJECT_SEMI = {
  page: {
    pageInfo: {
      pageName: '',
      errorCode: '',
      errorMessage: '',
    },
  },
  user: {
    pseudoID: '',
    journeyID: '',
    journeyName: '',
    journeyState: '',
    casa: '',
    gender: '',
    email: '',
  },
  form: {
    name: '',
  },
  link: {
    linkName: '',
    linkType: '',
    linkPosition: '',
  },
  event: {
    phone: '',
    validationMethod: '',
    status: '',
    rating: '',
  },
};

const ANALYTICS_PAGE_LOAD_OBJECT_SEMI = {
  page: {
    pageInfo: {
      pageName: '',
      errorCode: '',
      errorMessage: '',
    },
  },
  user: {
    pseudoID: '',
    journeyID: '',
    journeyName: '',
    journeyState: '',
    casa: '',
  },
  form: {
    name: '',
  },
};

export {
  ANALYTICS_LINK_BTN,
  ANALYTICS_PAGE_NAME,
  ANALYTICS_JOURNEY_STATE,
  ANALYTICS_EVENT_NAME,
  ANALYTICS_OBJECT_SEMI,
  ANALYTICS_PAGE_LOAD_OBJECT_SEMI,
};
