import corpCreditCard from './constants.js';
import { formUtil, urlPath } from './formutils.js';
import { corpCreditCardContext, invokeJourneyDropOffUpdate } from './journey-utils.js';
import { restAPICall } from './makeRestAPI.js';

function getCurrentDateAndTime(dobFormatNo) {
  /*
      dobFormatNo: 1 (DD-MM-YYYY HH:MM:SS)
      dobFormatNo: 2 (YYYYMMDDHHMMSS)
      dobFormatNo: 3 (DDMMYYYYHHMMSS)
  */
  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const todaySDate = newDate.getDate();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();

  if (dobFormatNo === '1') {
    return `${todaySDate}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
  return `${year}-${month}-${todaySDate} ${hours}:${minutes}:${seconds}`;
}

const { currentFormContext } = corpCreditCardContext;
const fetchFiller4 = (mobileMatch, kycStatus) => {
  let filler4Value = null;
  switch (kycStatus) {
    case 'aadhar':
      // eslint-disable-next-line no-nested-ternary
      filler4Value = (currentFormContext?.journeyType === 'NTB') ? `VKYC${getCurrentDateAndTime(3)}` : ((currentFormContext?.journeyType === 'ETB') && mobileMatch) ? `NVKYC${getCurrentDateAndTime(3)}` : `VKYC${getCurrentDateAndTime(3)}`;
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
  const segment = formContextCallbackData?.breDemogResponse?.SEGMENT;
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

  const mobileMatch = globals.functions.exportData()?.aadhaar_otp_val_data?.result?.mobileValid === 'y';
  const filler4 = fetchFiller4(mobileMatch, kycFill.KYC_STATUS);
  const { executeInterfaceResPayload } = formContextCallbackData;
  const filler2 = executeInterfaceResPayload ? `${executeInterfaceResPayload?.applicationRefNumber}X${executeInterfaceResPayload?.eRefNumber}` : '';
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
      Segment: segment,
      biometricStatus: kycFill.KYC_STATUS,
      filler2,
      filler4,
      filler5: 'English',
    },
  };
  return finalDapPayload;
};

const updatePanelVisibility = (response, globals) => {
  const successResultPanel = formUtil(globals, globals.form.resultPanel.successResultPanel);
  const errorResultPanel = formUtil(globals, globals.form.resultPanel.errorResultPanel);
  const {
    loginPanel, consentFragment, getOTPbutton, welcomeText,
  } = globals.form;
  [loginPanel, consentFragment, getOTPbutton, welcomeText].map((el) => formUtil(globals, el)).forEach((item) => item.visible(false));

  if (true) {
    successResultPanel.visible(true);
    errorResultPanel.visible(false);
  } else {
    errorResultPanel.visible(true);
  }
};

const finalDap = (globals) => {
  const apiEndPoint = urlPath(corpCreditCard.endpoints.finalDap);
  const payload = createDapRequestObj(globals);

  const eventHandlers = {
    successCallBack: (response) => {
      const formContextCallbackData = globals.functions.exportData()?.currentFormContext;
      const mobileNumber = globals.functions.exportData().form.login.registeredMobileNumber;
      const leadProfileId = globals.functions.exportData().leadProifileId;
      const journeyId = formContextCallbackData.journeyID;
      if (response?.errorCode === '0000') {
        invokeJourneyDropOffUpdate('FINAL_DAP_SUCCESS', mobileNumber, leadProfileId, journeyId, globals);
        const resultPanel = formUtil(globals, globals.form.resultPanel);
        resultPanel.visible(true);
        globals.functions.setProperty(globals.form.confirmResult, { visible: false });
        globals.functions.setProperty(globals.form.resultPanel.successResultPanel, { visible: true });
        globals.functions.setProperty(globals.form.resultPanel.errorResultPanel, { visible: false });
        globals.functions.setProperty(globals.form.corporateCardWizardView, { visible: false });
      } else {
        invokeJourneyDropOffUpdate('FINAL_DAP_FAILURE', mobileNumber, leadProfileId, journeyId, globals);
        const resultPanel = formUtil(globals, globals.form.resultPanel);
        resultPanel.visible(true);
        globals.functions.setProperty(globals.form.confirmResult, { visible: false });
        globals.functions.setProperty(globals.form.resultPanel.successResultPanel, { visible: false });
        globals.functions.setProperty(globals.form.resultPanel.errorResultPanel, { visible: true });
        globals.functions.setProperty(globals.form.corporateCardWizardView, { visible: false });
      }
    },
    errorCallback: (response) => {
      console.log(response);
    },
  };
  // const res = {};
  // updatePanelVisibility(res, globals);

  restAPICall('', 'POST', payload, apiEndPoint, eventHandlers.successCallBack, eventHandlers.errorCallback);
};
export { finalDap, updatePanelVisibility };
