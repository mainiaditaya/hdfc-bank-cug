/* eslint-disable no-console */
import {
  urlPath,
  moveWizardView,
  formUtil,
  composeNameOption,
  setSelectOptions,
} from './formutils.js';
import { currentFormContext } from './journey-utils.js';
import { restAPICall } from './makeRestAPI.js';

const GENDER_MAP = {
  M: '1',
  F: '2',
  O: '3',
  1: '1',
  2: '2',
  3: '3',
  Male: '1',
  Female: '2',
  Other: '3',
  T: '3',
};
let TOTAL_TIME = 0;
const formatDate = (inputDate) => {
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

const createExecuteInterfaceRequestObj = (panCheckFlag, globals, breDemogResponse) => {
  const {
    personalDetails,
    currentDetails,
    employmentDetails,
  } = globals.form.corporateCardWizardView.yourDetailsPanel.yourDetailsPage;
  const { prefilledEmploymentDetails } = employmentDetails;
  const fullName = `${personalDetails.firstName.$value} ${personalDetails.middleName.$value} ${personalDetails.lastName.$value}`;
  let isAddressEditFlag = 'Y';
  let panEditFlag = 'Y';
  const panNumber = personalDetails.panNumberPersonalDetails.$value;
  let nameEditFlag = 'Y';
  const currentAddress = {
    address1: '',
    address2: '',
    address3: '',
    city: '',
    pincode: '',
    state: '',
  };
  let permanentAddress = { ...currentAddress };
  if (currentFormContext.journeyType === 'ETB') {
    if (breDemogResponse?.VDCUSTITNBR !== panNumber) {
      panEditFlag = 'Y';
    }
    if (breDemogResponse.VDCUSTFULLNAME === fullName) {
      nameEditFlag = 'N';
    }
    const customerFiller2 = breDemogResponse?.BREFILLER2?.toUpperCase();
    if (customerFiller2 === 'D106') {
      [currentAddress.address1, currentAddress.address2, currentAddress.address3] = currentFormContext.customerParsedAddress;
      currentAddress.city = breDemogResponse.VDCUSTCITY;
      currentAddress.pincode = breDemogResponse.VDCUSTZIPCODE;
      currentAddress.state = breDemogResponse.VDCUSTSTATE;
    } else {
      currentAddress.address1 = breDemogResponse?.VDCUSTADD1;
      currentAddress.address2 = breDemogResponse?.VDCUSTADD2;
      currentAddress.address3 = breDemogResponse?.VDCUSTADD3;
      currentAddress.city = breDemogResponse.VDCUSTCITY;
      currentAddress.pincode = breDemogResponse.VDCUSTZIPCODE;
      currentAddress.state = breDemogResponse.VDCUSTSTATE;
    }
    if (currentDetails.currentAddressETB.currentAddressToggle.$value === 'on') {
      const { newCurentAddressPanel } = currentDetails.currentAddressETB;
      permanentAddress.address1 = newCurentAddressPanel.newCurentAddressLine1.$value;
      permanentAddress.address2 = newCurentAddressPanel.newCurentAddressLine2.$value;
      permanentAddress.address3 = newCurentAddressPanel.newCurentAddressLine3.$value;
      permanentAddress.city = newCurentAddressPanel.newCurentAddressCity.$value;
      permanentAddress.pincode = newCurentAddressPanel.newCurentAddressPin.$value;
      permanentAddress.state = newCurentAddressPanel.newCurentAddressState.$value;
    } else {
      isAddressEditFlag = 'N';
      permanentAddress = { ...currentAddress };
    }
  } else {
    const { currentAddressNTB } = currentDetails;
    const { permanentAddressPanel } = currentAddressNTB.permanentAddress;
    currentAddress.address1 = currentAddressNTB.addressLine1.$value;
    currentAddress.address2 = currentAddressNTB.addressLine2.$value;
    currentAddress.address3 = currentAddressNTB.addressLine3.$value;
    currentAddress.city = currentAddressNTB.city.$value;
    currentAddress.pincode = currentAddressNTB.currentAddresPincodeNTB.$value;
    currentAddress.state = currentAddressNTB.state.$value;
    if (currentAddressNTB.permanentAddress.permanentAddressToggle.$value === 'on') {
      permanentAddress = { ...currentAddress };
    } else {
      permanentAddress.address1 = permanentAddressPanel.permanentAddressLine1.$value;
      permanentAddress.address2 = permanentAddressPanel.permanentAddressLine2.$value;
      permanentAddress.address3 = permanentAddressPanel.permanentAddressLine3.$value;
      permanentAddress.city = permanentAddressPanel.permanentAddressCity.$value;
      permanentAddress.pincode = permanentAddressPanel.permanentAddressPincode.$value;
      permanentAddress.state = permanentAddressPanel.permanentAddressState.$value;
    }
  }
  const requestObj = {
    requestString: {
      bankEmployee: 'N',
      mobileNumber: globals.form.loginPanel.mobilePanel.registeredMobileNumber.$value,
      fullName,
      panCheckFlag,
      perAddressType: '2',
      personalEmailId: personalDetails.personalEmailAddress.$value,
      selfConfirmation: 'N',
      addressEditFlag: isAddressEditFlag,
      communicationAddress1: currentAddress.address1,
      communicationAddress2: currentAddress.address2,
      communicationCity: currentAddress.city,
      dateOfBirth: formatDate(personalDetails.dobPersonalDetails.$value),
      firstName: personalDetails.firstName.$value,
      lastName: personalDetails.lastName.$value,
      gender: GENDER_MAP[personalDetails.gender.$value],
      occupation: '5',
      officialEmailId: prefilledEmploymentDetails.workEmailAddress.$value,
      panEditFlag,
      panNumber,
      permanentAddress1: permanentAddress.address1,
      permanentAddress2: permanentAddress.address2,
      permanentCity: permanentAddress.city,
      permanentZipCode: String(permanentAddress.pincode),
      eReferenceNumber: breDemogResponse?.BREFILLER3,
      nameEditFlag,
      mobileEditFlag: currentFormContext.journeyType === 'ETB' ? 'N' : 'Y',
      resPhoneEditFlag: 'N',
      comAddressType: '2',
      comCityZip: String(currentAddress.pincode),
      customerID: currentFormContext.journeyType === 'ETB' ? breDemogResponse.FWCUSTID : '',
      timeInfo: new Date().toISOString(),
      Id_token_jwt: currentFormContext.jwtToken,
      communicationAddress3: currentAddress.address3,
      permanentAddress3: permanentAddress.address3,
      officeAddress1: employmentDetails.officeAddressLine1.$value,
      officeAddress2: employmentDetails.officeAddressLine2.$value,
      officeAddress3: employmentDetails.officeAddressLine3.$value,
      officeCity: employmentDetails.officeAddressCity.$value,
      officeZipCode: employmentDetails.officeAddressPincode.$value,
      officeState: employmentDetails.officeAddressState.$value,
      productCode: '',
      leadClosures: '',
      leadGenerater: '',
      applyingBranch: 'N',
      smCode: '',
      dseCode: '',
      lc2: '',
      filler6: '',
      branchName: '',
      branchCity: '',
      companyName: prefilledEmploymentDetails.companyName.$value,
      departmentOrEmpCode: prefilledEmploymentDetails.employeeCode.$value,
      designation: prefilledEmploymentDetails.designation.$value,
      middleName: personalDetails.middleName.$value,
      perfiosTxnID: '',
      monthlyincome: '',
      annualItr: '',
      permanentState: permanentAddress.state,
      communicationState: currentAddress.state,
      authMode: '',
      userAgent: navigator.userAgent,
      journeyID: currentFormContext.journeyID,
      journeyName: currentFormContext.journeyName,
      nameOnCard: fullName.length > 19 ? '' : fullName,
      dsaValue: '',
      cardsData: '',
      channelSource: '',
      isManualFlow: 'false',
      channel: '',
      apsDobEditFlag: 'N',
      apsEmailEditFlag: 'N',
      journeyFlag: currentFormContext.journeyType,
    },
  };
  return requestObj;
};

/**
 * create a list of name to be dispayed on card dropdown in confirm card screen.
 * @param {object} globals - globals variables object containing form configurations.
 */
const listNameOnCard = (globals) => {
  const elementNameSelect = 'nameOnCardDropdown';
  const { firstName, middleName, lastName } = currentFormContext.customerName;
  const dropDownSelectField = globals.form.corporateCardWizardView.confirmCardPanel.cardBenefitsPanel.CorporatetImageAndNamePanel.nameOnCardDropdown;
  const options = composeNameOption(firstName, middleName, lastName);
  const initialValue = options[0]?.value;
  setSelectOptions(options, elementNameSelect);
  const setDropdownField = formUtil(globals, dropDownSelectField);
  setDropdownField.setEnum(options, initialValue); // setting initial value
  moveWizardView('corporateCardWizardView', 'confirmCardPanel');
};

const terminateJourney = (globals) => {
  const resultPanel = formUtil(globals, globals.form.resultPanel);
  const wizardPanel = formUtil(globals, globals.form.corporateCardWizardView);
  wizardPanel.visible(false);
  resultPanel.visible(true);
};
const resumeJourney = (globals, response) => {
  currentFormContext.productDetails = response.productEligibility.productDetails?.[0];
  const { cardBenefitsTextBox } = globals.form.corporateCardWizardView.confirmCardPanel.cardBenefitsPanel.cardBenefitsFeaturesPanel;
  const cardBenefitsTextField = formUtil(globals, cardBenefitsTextBox);
  cardBenefitsTextField.setValue(response.productEligibility.productDetails[0].keyBenefits[0]);
  listNameOnCard(globals);
};

const sendIpaRequest = (ipaRequestObj, globals) => {
  const apiEndPoint = urlPath('/content/hdfc_etb_wo_pacc/api/ipa.json');
  const exceedTimeLimit = (TOTAL_TIME >= currentFormContext.ipaDuration * 1000);
  const eventHandlers = {
    successCallBack: (response) => {
      const ipaResult = response?.ipa?.ipaResult;
      const promoCode = currentFormContext?.promoCode;
      const ipaResNotPresent = (ipaResult === '' || ipaResult === 'null' || !ipaResult || ipaResult === 'undefined' || ipaResult === null);
      if (exceedTimeLimit) {
        resumeJourney(globals, response);
        return;
      }
      if (ipaResNotPresent) {
        setTimeout(() => sendIpaRequest(ipaRequestObj, globals), currentFormContext.ipaTimer * 1000);
        TOTAL_TIME += currentFormContext.ipaTimer * 1000;
      } else if (promoCode === 'NA' && ipaResult === 'Y') {
        terminateJourney(globals);
      } else {
        resumeJourney(globals, response);
      }
    },
    errorCallBack: (response) => {
      console.log(response);
    },
  };
  restAPICall('', 'POST', ipaRequestObj, apiEndPoint, eventHandlers.successCallBack, eventHandlers.errorCallBack, 'Loading');
};

const customerValidationHandler = {
  executeInterfaceApi: (APS_PAN_CHK_FLAG, globals, breDemogResponse) => {
    const requestObj = createExecuteInterfaceRequestObj(APS_PAN_CHK_FLAG, globals, breDemogResponse);
    currentFormContext.executeInterfaceReqObj = requestObj;
    const apiEndPoint = urlPath('/content/hdfc_etb_wo_pacc/api/executeinterface.json');
    const eventHandlers = {
      successCallBack: (response) => {
        if (response.errorCode === '0000') {
          currentFormContext.ipaDuration = response.ExecuteInterfaceResponse.ipaDuration;
          currentFormContext.ipaTimer = response.ExecuteInterfaceResponse.ipaTimer;
          const ipaRequestObj = {
            requestString: {
              mobileNumber: globals.form.loginPanel.mobilePanel.registeredMobileNumber.$value,
              applRefNumber: response.ExecuteInterfaceResponse.applicationRefNumber,
              eRefNumber: response.ExecuteInterfaceResponse.eRefNumber,
              Id_token_jwt: response.Id_token_jwt,
              userAgent: navigator.userAgent,
              journeyID: currentFormContext.journeyID,
              journeyName: currentFormContext.journeyName,
              productCode: currentFormContext.productCode,
            },
          };
          TOTAL_TIME = 0;
          sendIpaRequest(ipaRequestObj, globals);
        } else {
          console.log('terminate journey');
        }
      },
      errorCallBack: (response) => {
        console.log(response);
      },
    };
    restAPICall('', 'POST', requestObj, apiEndPoint, eventHandlers.successCallBack, eventHandlers.errorCallBack, 'Loading');
  },

  terminateJourney: (panStatus, globals) => {
    console.log(`pan Status: ${panStatus} and called terminateJourney()`);
    terminateJourney(globals);
  },

  restartJourney: (panStatus) => {
    console.log(`pan Status: ${panStatus} and called restartJourney()`);
  },
};

const executeInterfaceApiFinal = (globals) => {
  const requestObj = currentFormContext.executeInterfaceReqObj;
  currentFormContext.executeInterfaceReqObj.requestString.productCode = currentFormContext.productCode;
  const apiEndPoint = urlPath('/content/hdfc_etb_wo_pacc/api/executeinterface.json');
  const eventHandlers = {
    successCallBack: (response) => {
      console.log(response, globals);
    },
    errorCallBack: (response) => {
      console.log(response);
    },
  };
  restAPICall('', 'POST', requestObj, apiEndPoint, eventHandlers.successCallBack, eventHandlers.errorCallBack, 'Loading');
};

export {
  customerValidationHandler,
  executeInterfaceApiFinal,
};
