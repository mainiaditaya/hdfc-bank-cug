const data = {
  'otp click': {
    linkType: 'button',
    StepName: 'Identify Yourself',
  },
  'submit otp': {
    error: '',
  },
  'check offers': {
    linkType: 'button',
    linkName: 'Check Offers',
  },
  'get this card': {
    linkType: 'button',
    linkName: 'Get this Card',
  },
  'i agreee': {
    linkType: 'button',
    linkName: 'I agree',
  },
  'document upload continue': {
    linkType: 'button',
    linkName: 'I agree',
  },
};
const ANALYTICS_CLICK_OBJECT = {
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
  formDetails: {
    employmentType: '',
    companyName: '',
    designation: '',
    relationshipNumber: '',
    pincode: '',
    city: '',
    state: '',
    KYCVerificationMethod: '',
    languageSelected: '',
    reference: '',
    isVideoKYC: '',
    documentProof: '',
  },
  card: {
    selectedCard: '',
    eligibleCard: '',
    annualFee: '',
  },
};

const ANALYTICS_PAGE_LOAD_OBJECT = {
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
  data,
  ANALYTICS_CLICK_OBJECT,
  ANALYTICS_PAGE_LOAD_OBJECT,
};
