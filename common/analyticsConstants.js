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
  'address continue': {
    linkType: 'button',
    linkName: 'Submit',
  },
  'kyc continue': {
    linkType: 'button',
    linkName: 'Continue KYC',
  },
  // 'aadhaar otp': {
  //   linkType: '',
  //   linkName: '',
  // },
  'start kyc': {
    linkType: 'button',
    linkName: 'Start KYC',
  },
  'submit review': {
    linkType: 'button',
    linkName: 'Submit Feedback',
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

const PAGE_NAME = {
  'otp click': 'Identify yourself',
  'check offers': 'Your details',
  'get this card': 'Confirm Card',
  'kyc continue': 'Select KYC Method',
  'i agree': 'Select KYC Method',
  'document upload continue': 'Select KYC Method',
  'address continue': 'Confirm & Submit',
  'aadhaar otp': 'Aadhar portal screen',
  'start kyc': 'Thank you screen',
  'submit review': 'Thank you screen',
  'thank you screen': 'Thank you screen',
};
export {
  data,
  ANALYTICS_CLICK_OBJECT,
  ANALYTICS_PAGE_LOAD_OBJECT,
  PAGE_NAME,
};
