const ANALYTICS_EVENT_NAME = {
  'page load': 'page load',
  'otp click': 'otp click',
};

const ANALYTICS_JOURNEY_STATE = {
  'page load': 'CUSTOMER_IDENTITY_ACQUIRED',
  'otp click': 'CUSTOMER_IDENTITY_RESOLVED',
};

const ANALYTICS_PAGE_NAME = {
  'page load': 'Step 1 - Identify Yourself',
  'otp click': 'Step 1 - Identify Yourself',
  'submit otp': 'Step 2 - Verify with OTP',
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
    pageName: ANALYTICS_PAGE_NAME['submit otp'],
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
  card: {
    selectedCard: '',
    eligibleCard: '',
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
