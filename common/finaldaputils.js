import corpCreditCard from './constants.js';
import { formUtil, urlPath } from './formutils.js';
import { currentFormContext } from './journey-utils.js';
import { getJsonResponse } from './makeRestAPI.js';

const fetchFiller4 = (mobileMatch, kycStatus) => {
  let filler4Value = null;
  switch (kycStatus) {
    case 'aadhar':
      filler4Value = mobileMatch ? `NVKYC${new Date().toISOString()}` : `VKYC${new Date().toISOString()}`;
      break;
    case 'bioKYC':
      filler4Value = 'bioKYC';
      break;
    case 'OVD':
      filler4Value = 'OVD';
      break;
    default:
      filler4Value = null;
  }
  return filler4Value;
};
/**
 * Creates a DAP request object based on the provided global data.
 * @param {Object} globals - The global object containing necessary data for DAP request.
 * @returns {Object} - The DAP request object.
 */
const createDapRequestObj = (globals) => {
  const formContextCallbackData = globals.functions.exportData()?.currentFormContext;
  const customerInfo = currentFormContext?.executeInterfaceReqObj?.requestString || formContextCallbackData?.executeInterfaceReqObj?.requestString;
  // const { prefilledEmploymentDetails } = employmentDetails;
  const { selectKYCMethodOption1: { aadharEKYCVerification }, selectKYCMethodOption2: { aadharBiometricVerification }, selectKYCMethodOption3: { officiallyValidDocumentsMethod } } = globals.form.corporateCardWizardView.selectKycPanel.selectKYCOptionsPanel;
  const kycFill = {
    KYC_STATUS:
        (aadharEKYCVerification.$value && 'aadhar')
        || (aadharBiometricVerification.$value && 'bioKYC')
        || (officiallyValidDocumentsMethod.$value && 'OVD')
        || null,
  };
  const mobileMatch = globals.functions.exportData().aadhaar_otp_val_data.result.mobileValid === 'y';
  const filler4 = fetchFiller4(mobileMatch, kycFill.KYC_STATUS);
  const finalDapPayload = {
    requestString: {
      applRefNumber: formContextCallbackData?.applRefNumber,
      eRefNumber: formContextCallbackData?.eRefNumber,
      customerId: customerInfo.customerID,
      communicationCity: customerInfo.communicationCity,
      idcomStatus: 'N',
      id_token_jwt: currentFormContext.jwtToken || formContextCallbackData.jwtToken,
      motherFirstName: '',
      motherMiddleName: '',
      motherLastName: '',
      ckycNumber: '',
      motherNameTitle: '',
      mobileNumber: globals.form.loginPanel.mobilePanel.registeredMobileNumber.$value,
      userAgent: navigator.userAgent,
      journeyID: currentFormContext.journeyID,
      journeyName: currentFormContext.journeyName,
      filler7: '',
      Segment: 'ONLY_HL',
      biometricStatus: kycFill.KYC_STATUS,
      filler2: '',
      filler4,
      filler5: `${new Date().toISOString()}Y`,
    },
  };
  return finalDapPayload;
};

const updatePanelVisibility = (response, globals) => {
  const corporateCardWizardView = formUtil(globals, globals.form.corporateCardWizardView);
  const confirmAndSubmitPanel = formUtil(globals, globals.form.corporateCardWizardView.confirmAndSubmitPanel);
  const successResultPanel = formUtil(globals, globals.form.resultPanel.successResultPanel);
  const errorResultPanel = formUtil(globals, globals.form.resultPanel.errorResultPanel);
  const resultPanel = formUtil(globals, globals.form.resultPanel);
  corporateCardWizardView.visible(false);
  confirmAndSubmitPanel.visible(false);
  resultPanel.visible(true);

  if (response?.finalDap?.errorCode === '0000') {
    successResultPanel.visible(true);
    errorResultPanel.visible(false);
  } else {
    errorResultPanel.visible(true);
  }
};

const finalDap = async (globals) => {
  const apiEndPoint = urlPath(corpCreditCard.endpoints.finalDap);
  const errorSuccessMethod = (res, global) => {
    const {
      loginPanel, consentFragment, getOTPbutton, welcomeText,
    } = global.form;
    [loginPanel, consentFragment, getOTPbutton, welcomeText].map((el) => formUtil(global, el)).forEach((item) => item.visible(false));
    updatePanelVisibility(res, global);
  };
  try {
    const payload = await createDapRequestObj(globals);
    const response = payload && await getJsonResponse(apiEndPoint, payload, 'POST');
    errorSuccessMethod(response, globals);
  } catch (error) {
    errorSuccessMethod(error, globals);
  }
};
export default finalDap;
