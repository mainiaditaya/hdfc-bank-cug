import { CURRENT_FORM_CONTEXT } from '../../common/constants.js';
import { urlPath } from '../../common/formutils.js';
import { restAPICall } from '../../common/makeRestAPI.js';
import { invokeJourneyDropOffUpdate } from '../corporate-creditcard/journey-utils.js';
import { FD_ENDPOINTS } from './constant.js';
import finalPagePanelVisibility from './thankyouutil.js';

/**
 * Creates a DAP request object based on the provided global data.
 * @param {Object} globals - The global object containing necessary data for DAP request.
 * @returns {Object} - The DAP request object.
 */
const createDapRequestObj = (globals) => {
  const formContextCallbackData = globals.functions.exportData()?.currentFormContext || CURRENT_FORM_CONTEXT;
  const finalDapPayload = {
    requestString: {
      applRefNumber: formContextCallbackData?.executeInterfaceResponse?.APS_APPL_REF_NUM,
      eRefNumber: formContextCallbackData?.executeInterfaceResponse?.APS_E_REF_NUM,
      customerId: formContextCallbackData?.executeInterfaceRequest?.requestString?.customerID,
      communicationCity: formContextCallbackData?.executeInterfaceRequest?.requestString?.communicationCity,
      motherFirstName: '',
      motherMiddleName: '',
      motherLastName: '',
      ckycNumber: '',
      motherNameTitle: '',
      mobileNumber: globals.form.loginMainPanel.loginPanel.mobilePanel.registeredMobileNumber.$value,
      journeyID: formContextCallbackData?.journeyID || CURRENT_FORM_CONTEXT?.journeyID,
      journeyName: formContextCallbackData?.journeyName || CURRENT_FORM_CONTEXT?.journeyName,
      filler7: '',
      filler1: '',
      biometricStatus: formContextCallbackData?.selectedKyc ?? '',
    },
  };
  return finalDapPayload;
};

const finalDap = (userRedirected, globals) => {
  const { resultPanel, fdBasedCreditCardWizard } = globals.form;
  const { successResultPanel } = resultPanel;

  const { vkycConfirmationPanel } = successResultPanel;
  const apiEndPoint = urlPath(FD_ENDPOINTS.hdfccardsexecutefinaldap);
  const payload = createDapRequestObj(globals);
  const formData = globals.functions.exportData();
  const formContextCallbackData = formData?.CURRENT_FORM_CONTEXT || CURRENT_FORM_CONTEXT;
  const mobileNumber = formData?.form?.login?.registeredMobileNumber || globals.form.loginMainPanel.loginPanel.mobilePanel.registeredMobileNumber.$value;
  const leadProfileId = formData?.leadProifileId || globals?.form?.runtime?.leadProifileId.$value;
  const journeyId = formContextCallbackData?.journeyID;
  const eventHandlers = {
    successCallBack: async (response) => {
      if (response?.ExecuteFinalDAPResponse?.APS_ERROR_CODE === '0000') {
        debugger;
        CURRENT_FORM_CONTEXT.finalDapRequest = JSON.parse(JSON.stringify(payload));
        CURRENT_FORM_CONTEXT.finalDapResponse = response?.ExecuteFinalDAPResponse;
        CURRENT_FORM_CONTEXT.VKYC_URL = response?.ExecuteFinalDAPResponse?.vkycUrl;
        CURRENT_FORM_CONTEXT.ARN_NUM = response?.ExecuteFinalDAPResponse?.APS_APPL_REF_NUM;
        CURRENT_FORM_CONTEXT.action = 'confirmation';
        window.finalDapRequest = JSON.parse(JSON.stringify(payload));
        window.finalDapResponse = response?.ExecuteFinalDAPResponse;
        window.VKYC_URL = response?.ExecuteFinalDAPResponse?.vkycUrl;
        window.ARN_NUM = response?.ExecuteFinalDAPResponse?.APS_APPL_REF_NUM;
        window.action = 'confirmation';
        const dropoffResponse = await Promise.resolve(invokeJourneyDropOffUpdate('CUSTOMER_FINAL_DAP_SUCCESS', mobileNumber, leadProfileId, journeyId, globals));
        console.log(dropoffResponse);
        if (!userRedirected) {
          globals.functions.setProperty(vkycConfirmationPanel, { visible: false });
          finalPagePanelVisibility('success', CURRENT_FORM_CONTEXT.ARN_NUM, globals);
        }
      } else {
        invokeJourneyDropOffUpdate('CUSTOMER_FINAL_DAP_FAILURE', mobileNumber, leadProfileId, journeyId, globals);
        if (!userRedirected) {
          finalPagePanelVisibility('error', '', globals);
        }
      }
    },
    errorCallback: (response, globalObj) => {
      globalObj.functions.setProperty(fdBasedCreditCardWizard, { visible: false });
      globalObj.functions.setProperty(resultPanel, { visible: true });
      globalObj.functions.setProperty(resultPanel.errorResultPanel, { visible: true });
      invokeJourneyDropOffUpdate('CUSTOMER_FINAL_DAP_FAILURE', mobileNumber, leadProfileId, journeyId, globalObj);
    },
  };
  restAPICall(globals, 'POST', payload, apiEndPoint, eventHandlers.successCallBack, eventHandlers.errorCallback);
};
export default finalDap;
