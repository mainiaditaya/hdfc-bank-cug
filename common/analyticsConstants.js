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
};
const ANALYTICS_OBJECT = {
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
    email: 'erwqrwerwerwer',
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
  },
  card: {
    selectedCard: '',
    eligibleCard: '',
    annualFee: '',
  },
};

export {
  data,
  ANALYTICS_OBJECT,
};
