import { CURRENT_FORM_CONTEXT, FORM_RUNTIME as formRuntime } from '../../common/constants.js';
import {
  composeNameOption,
  formUtil,
  urlPath,
  getUrlParamCaseInsensitive,
  ageValidator,
  parseCustomerAddress,
  splitName,
  parseName,
  removeSpecialCharacters,
  pincodeCheck,
} from '../../common/formutils.js';
import { getJsonResponse, displayLoader } from '../../common/makeRestAPI.js';
import { addDisableClass, setSelectOptions } from '../domutils/domutils.js';
import {
  FD_ENDPOINTS, NAME_ON_CARD_LENGTH, AGE_LIMIT, ERROR_MSG,
  MIN_ADDRESS_LENGTH,
  GENDER_MAP,
  OCCUPATION_MAP,
  ALLOWED_CHARACTERS,
} from './constant.js';
import { validatePan } from '../../common/functions.js';

let CUSTOMER_DATA_BINDING_CHECK = true;
const CUSTOMER_DETAILS_STATE = {
  panCheckCount: 0,
  maxPanCheckCount: 3,
  onLoad: true,
};

const initializeNameOnCardDdOptions = (globals, personalDetails, customerFirstName, customerMiddleName, customerLastName) => {
  const elementNameSelect = 'nameOnCardDD';
  let options = [];
  setSelectOptions(options, elementNameSelect);
  options = composeNameOption(
    customerFirstName.toUpperCase(),
    customerMiddleName.toUpperCase(),
    customerLastName.toUpperCase(),
    'fd',
    NAME_ON_CARD_LENGTH,
  );
  const initialValue = options[0]?.value;
  setSelectOptions(options, elementNameSelect);
  const ddOption = options.map((item) => item.label);
  globals.functions.setProperty(personalDetails.nameOnCardDD, { enum: ddOption, value: initialValue });
};

/**
 * @name bindEmployeeAssistanceField
 * @returns {Promise<Object>} - A promise that resolves with the JSON response from the provided URL.
 */
const bindEmployeeAssistanceField = async (globals) => {
  const { resultPanel, fdBasedCreditCardWizard } = globals.form;
  const { employeeAssistancePanel, employeeAssistanceToggle, inPersonBioKYCPanel } = fdBasedCreditCardWizard.basicDetails.reviewDetailsView.employeeAssistance;
  const defaultChannel = getUrlParamCaseInsensitive('channel');
  const inPersonBioKYC = getUrlParamCaseInsensitive('InpersonBioKYC');
  const codes = {
    lc1Code: getUrlParamCaseInsensitive('lc1'),
    lgCode: getUrlParamCaseInsensitive('lgcode'),
    smCode: getUrlParamCaseInsensitive('smcode'),
    lc2Code: getUrlParamCaseInsensitive('lc2'),
    dsaCode: getUrlParamCaseInsensitive('dsacode'),
    branchCode: getUrlParamCaseInsensitive('branchcode'),
  };

  try {
    if (defaultChannel || Object.values(codes).some(Boolean)) {
      globals.functions.setProperty(employeeAssistanceToggle, { value: 'on', enabled: false });
    }
    if (inPersonBioKYC?.toLowerCase() === 'yes') {
      globals.functions.setProperty(inPersonBioKYCPanel, { visible: true });
      globals.functions.setProperty(inPersonBioKYCPanel.inPersonBioKYCOptions, { value: 0 });
    }
    const response = await getJsonResponse(FD_ENDPOINTS.masterchannel, null, 'GET');
    if (!response) return;
    if (response?.[0].errorCode === '500') {
      globals.functions.setProperty(resultPanel, { visible: true });
      globals.functions.setProperty(fdBasedCreditCardWizard, { visible: false });
      globals.functions.setProperty(resultPanel.errorResultPanel, { visible: true });
    }
    const dropDownSelectField = employeeAssistancePanel.channel;
    const channelOptions = ['Website Download'];
    const options = channelOptions.map((channel) => ({ label: channel, value: channel }));
    let matchedChannel = options[0].value;
    let disableChannelDropdown = false;
    response.forEach((item) => {
      const channel = item?.CHANNELS;
      const normalizedChannel = channel?.toLowerCase();
      if (!channelOptions.some((opt) => opt.toLowerCase() === normalizedChannel)) {
        options.push({ label: channel, value: channel });
        channelOptions.push(channel);
      }
      if (defaultChannel?.toLowerCase() === normalizedChannel) {
        matchedChannel = channel;
        disableChannelDropdown = true;
      }
    });
    setSelectOptions(options, 'channel');
    globals.functions.setProperty(dropDownSelectField, { enum: channelOptions, value: matchedChannel });
    if (disableChannelDropdown) {
      globals.functions.setProperty(dropDownSelectField, { enabled: false });
    }
    const changeDataAttrObj = { attrChange: true, value: false, disable: true };
    ['lc1Code', 'lgCode', 'smCode', 'lc2Code', 'dsaCode', 'branchCode'].forEach((code) => {
      const util = formUtil(globals, employeeAssistancePanel[code]);
      if (codes[code] !== null) util.setValue(codes[code], changeDataAttrObj);
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Binds customer details from the global context to the current form.
 * @name bindCustomerDetails
 * @param {Object} globals - The global context object containing various information.
 */
const bindCustomerDetails = async (globals) => {
  if (!CUSTOMER_DATA_BINDING_CHECK) return;
  CURRENT_FORM_CONTEXT.customerIdentityChange = false;
  CURRENT_FORM_CONTEXT.editFlags = {
    nameOnCard: true,
  };
  CURRENT_FORM_CONTEXT.customerAddress = {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    pincode: '',
    state: '',
  };
  CURRENT_FORM_CONTEXT.permanentAddress = {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    pincode: '',
    state: '',
  };
  CUSTOMER_DATA_BINDING_CHECK = false;
  formRuntime.validatePanLoader = (typeof window !== 'undefined') ? displayLoader : false;
  bindEmployeeAssistanceField(globals);
  const { customerInfo } = CURRENT_FORM_CONTEXT;

  const { firstName, middleName, lastName } = parseName(customerInfo.customerFullName);
  customerInfo.customerFirstName = firstName;
  customerInfo.customerMiddleName = middleName;
  customerInfo.customerLastName = lastName;
  const parsedFullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ');
  CURRENT_FORM_CONTEXT.nameParsed = customerInfo.customerFullName !== parsedFullName;
  customerInfo.customerFullName = parsedFullName;

  CURRENT_FORM_CONTEXT.customerIdentityChange = false;
  if (!customerInfo.datBirthCust || !customerInfo.refCustItNum || !customerInfo.genderDescription) CURRENT_FORM_CONTEXT.customerIdentityChange = true;
  const changeDataAttrObj = { attrChange: true, value: false, disable: true };
  const { reviewDetailsView } = globals.form.fdBasedCreditCardWizard.basicDetails;
  const { personalDetails, addressDetails, employmentDetails } = reviewDetailsView;

  const setFormValue = (field, value) => {
    const fieldUtil = formUtil(globals, field);
    fieldUtil.setValue(value, changeDataAttrObj);
  };
  setFormValue(personalDetails.fullName, customerInfo.customerFullName);
  setFormValue(personalDetails.gender, GENDER_MAP[customerInfo.genderDescription]);
  if (customerInfo.datBirthCust) { setFormValue(personalDetails.dateOfBirthPersonalDetails, customerInfo.datBirthCust); }
  if (customerInfo.refCustItNum) {
    const formattedPan = customerInfo.refCustItNum.replace(/([A-Za-z])(\d)|(\d)([A-Za-z])/g, '$1$3 $2$4');
    if (formattedPan !== '') setFormValue(personalDetails.panNumberPersonalDetails, formattedPan);
  }

  const [address = '', cityDetails = ''] = customerInfo.currentAddress.split('||');
  CURRENT_FORM_CONTEXT.perAddExist = false;
  let perAddress = ''; let perCityDetails = '';
  if (customerInfo.permanentAddress) {
    perAddress = customerInfo.permanentAddress.split('||')?.[0];
    perCityDetails = customerInfo.permanentAddress.split('||')?.[1];
    CURRENT_FORM_CONTEXT.perAddExist = true;
  }
  const [perCity = '', perState = '', perPincode = ''] = perCityDetails.split('|');
  const [city = '', state = '', pincode = ''] = cityDetails.split('|');
  const cleanAddress = removeSpecialCharacters(address.replace(/\|/g, ' '), ALLOWED_CHARACTERS);
  const cleanPerAddress = removeSpecialCharacters(perAddress.replace(/\|/g, ' '), ALLOWED_CHARACTERS);

  let formattedCustomerAddress = '';
  let parsedAddress = [];
  let parsedPerAddress = [];
  if (cleanAddress.length < MIN_ADDRESS_LENGTH) {
    const addressArray = cleanAddress.trim().split(' ');
    parsedAddress = [
      addressArray.slice(0, -1).join(' '),
      addressArray.slice(-1)[0],
    ];
  } else {
    parsedAddress = parseCustomerAddress(cleanAddress);
  }
  if (cleanPerAddress.length < MIN_ADDRESS_LENGTH) {
    const addressArray = cleanPerAddress.trim().split(' ');
    parsedPerAddress = [
      addressArray.slice(0, -1).join(' '),
      addressArray.slice(-1)[0],
    ];
  } else {
    parsedPerAddress = parseCustomerAddress(cleanPerAddress);
  }

  if (parsedAddress.length) {
    const [addressLine1 = '', addressLine2 = '', addressLine3 = ''] = parsedAddress;
    Object.assign(CURRENT_FORM_CONTEXT.customerAddress, { addressLine1, addressLine2, addressLine3 });
    formattedCustomerAddress = `${parsedAddress.join(' ')}, ${pincode}, ${city}, ${state}`;
  } else {
    formattedCustomerAddress = `${cleanAddress}, ${city}, ${state}, ${pincode}`;
    const [addressLine1 = '', addressLine2 = '', addressLine3 = ''] = address.split('|');
    Object.assign(CURRENT_FORM_CONTEXT.customerAddress, { addressLine1, addressLine2, addressLine3 });
  }

  const validPin = await pincodeCheck(pincode, city, state);

  if (validPin.result === 'false') {
    globals.functions.setProperty(addressDetails.mailingAddressToggle, { value: 'off', enabled: false });
    globals.functions.setProperty(addressDetails.pinCodeNotMatch, { visible: true });
  }

  Object.assign(CURRENT_FORM_CONTEXT.customerAddress, { city, pincode, state });

  if (parsedPerAddress.length) {
    const [addressLine1 = '', addressLine2 = '', addressLine3 = ''] = parsedPerAddress;
    Object.assign(CURRENT_FORM_CONTEXT.permanentAddress, { addressLine1, addressLine2, addressLine3 });
  } else {
    const [addressLine1 = '', addressLine2 = '', addressLine3 = ''] = address.split('|');
    Object.assign(CURRENT_FORM_CONTEXT.permanentAddress, { addressLine1, addressLine2, addressLine3 });
  }

  Object.assign(CURRENT_FORM_CONTEXT.permanentAddress, { city: perCity, pincode: perPincode, state: perState });

  setFormValue(addressDetails.prefilledMailingAdddress, formattedCustomerAddress);
  const emailIDUtil = formUtil(globals, personalDetails.emailID);
  emailIDUtil.setValue(customerInfo.refCustEmail, { attrChange: true, value: false });
  if (customerInfo.currentAddress.length === 0) {
    globals.functions.setProperty(addressDetails.prefilledMailingAdddress, { visible: false });
    globals.functions.setProperty(addressDetails.mailingAddressToggle, { value: 'off', enabled: false });
  }
  const {
    customerFullName, customerFirstName, customerMiddleName, customerLastName,
  } = customerInfo;

  if (customerFullName.length <= NAME_ON_CARD_LENGTH && (customerMiddleName || customerLastName)) {
    setFormValue(personalDetails.nameOnCard, customerFullName.toUpperCase());
  } else {
    const hasNoMiddleOrLastName = !customerMiddleName && !customerLastName;

    globals.functions.setProperty(personalDetails.nameOnCard, { visible: false });
    globals.functions.setProperty(personalDetails.nameOnCardDD, { visible: true });
    CURRENT_FORM_CONTEXT.editFlags.nameOnCard = false;
    if (hasNoMiddleOrLastName) {
      globals.functions.setProperty(personalDetails.fathersFullName, { visible: true });
    }

    initializeNameOnCardDdOptions(globals, personalDetails, customerFirstName, customerMiddleName, customerLastName);
  }

  globals.functions.setProperty(employmentDetails.employmentType, OCCUPATION_MAP[customerInfo?.employeeDetail?.txtOccupDesc?.toLowerCase()]);

  const personaldetails = document.querySelector('.field-personaldetails');
  setTimeout(() => {
    addDisableClass(personaldetails, ['nameOnCardDD', 'emailID', 'employmentType']);
  }, 100);
};

/**
 *
 * @name validateEmailID
 * @param {Object} globals - The global context object containing various information.
 */
const validateEmailID = async (email, globals) => {
  const url = urlPath(FD_ENDPOINTS.emailId);
  const invalidMsg = 'Please enter a valid Email ID';
  const payload = {
    email,
  };
  const method = 'POST';
  try {
    const emailValid = await getJsonResponse(url, payload, method);
    if (emailValid === true) {
      globals.functions.setProperty(globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.personalDetails.emailID, { valid: true });
    } else if (email !== '') {
      globals.functions.markFieldAsInvalid('$form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.personalDetails.emailID', invalidMsg, { useQualifiedName: true });
    }
  } catch (error) {
    console.error(error, 'error in emailValid');
  }
};

const setVisibility = (panel, properties, visibility, globals) => {
  properties.forEach((property) => {
    globals.functions.setProperty(panel[property], { visible: visibility });
  });
};

/**
 *
 * @name channelChangeHandler
 * @param {Object} globals - The global context object containing various information.
 */
const channelChangeHandler = (globals) => {
  const { employeeAssistancePanel } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.employeeAssistance;
  const channelValue = employeeAssistancePanel.channel._data.$_value;

  const visibilitySettings = {
    'website download': ['branchCity', 'branchCode', 'branchName', 'cardsBdrLc1', 'tseLgCode', 'dsaCode', 'dsaName', 'lc1Code', 'lc2Code', 'lgCode', 'smCode'],
    branch: ['dsaCode', 'dsaName', 'lc1Code', 'lgCode'],
    dsa: ['branchCity', 'branchCode', 'branchName', 'tseLgCode', 'cardsBdrLc1'],
    default: ['branchCity', 'branchCode', 'branchName', 'cardsBdrLc1', 'tseLgCode', 'dsaCode', 'dsaName'],
  };

  const propertiesToHide = visibilitySettings[channelValue.toLowerCase()] || visibilitySettings.default;
  setVisibility(employeeAssistancePanel, propertiesToHide, false, globals);
};

/**
 *
 * @name dsaCodeHandler
 * @param {Object} globals - The global context object containing various information.
 */
const dsaCodeHandler = async (globals) => {
  const { employeeAssistancePanel } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.employeeAssistance;
  const dsaCode = employeeAssistancePanel.dsaCode._data.$_value?.toLowerCase();
  const url = `${FD_ENDPOINTS.dsamaster}${dsaCode}.json`;

  try {
    const response = await getJsonResponse(url, null, 'GET');

    if (response && response.length === 1) {
      const { DSA_CODE, DSA_NAME } = response[0];

      if (DSA_CODE.toLowerCase() === dsaCode) {
        const changeDataAttrObj = { attrChange: true, value: false, disable: true };
        const dsaNameUtil = formUtil(globals, employeeAssistancePanel.dsaName);
        dsaNameUtil.setValue(DSA_NAME, changeDataAttrObj);
        return;
      }
    }
    globals.functions.setProperty(employeeAssistancePanel.dsaName, { value: '', readOnly: false });
  } catch (error) {
    console.log(error);
  }
};

/**
*
* @name branchCodeHandler
* @param {Object} globals - The global context object containing various information.
*/
const branchCodeHandler = async (globals) => {
  const { employeeAssistancePanel } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.employeeAssistance;
  const branchCode = employeeAssistancePanel.branchCode._data.$_value;
  const url = `${FD_ENDPOINTS.branchMaster}${branchCode}.json`;
  const branchNameUtil = formUtil(globals, employeeAssistancePanel.branchName);
  const branchCityUtil = formUtil(globals, employeeAssistancePanel.branchCity);
  try {
    const response = await getJsonResponse(url, null, 'GET');
    if (response?.total === 1) {
      const changeDataAttrObj = { attrChange: true, value: false, disable: true };
      branchNameUtil.setValue(response.branchDetails[0].Name, changeDataAttrObj);
      branchCityUtil.setValue(response.cityDetails[0].CityName, changeDataAttrObj);
    }
  } catch (error) {
    globals.functions.setProperty(employeeAssistancePanel.branchName, { value: '', readOnly: false });
    globals.functions.setProperty(employeeAssistancePanel.branchCity, { value: '', readOnly: false });
  }
};

/**
 * @name dobPanChangeHandler
 * @param {Object} globals - The global state object containing form details.
 */
const dobChangeHandler = (globals) => {
  const { personalDetails } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView;
  if (ageValidator(AGE_LIMIT.min, AGE_LIMIT.max, personalDetails.dateOfBirthPersonalDetails.$value)) {
    globals.functions.markFieldAsInvalid('$form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.personalDetails.dateOfBirthPersonalDetails', '', { useQualifiedName: true });
  } else {
    globals.functions.markFieldAsInvalid('$form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.personalDetails.dateOfBirthPersonalDetails', ERROR_MSG.ageLimit, { useQualifiedName: true });
  }
};

const fullNameChangeHandler = (globals) => {
  const { customerInfo } = CURRENT_FORM_CONTEXT;
  const { personalDetails } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView;
  const customerFullName = personalDetails.fullName._data.$_value || '';

  // Split name and assign customer info
  const { firstName, middleName = '', lastName = '' } = splitName(customerFullName);
  Object.assign(customerInfo, {
    customerFirstName: firstName,
    customerMiddleName: middleName,
    customerLastName: lastName,
    customerFullName,
    customerIdentityChange: !customerInfo?.customerFullName ? true : customerInfo?.customerIdentityChange,
  });

  // Handle name on card visibility
  const nameOnCardVisible = customerFullName.length <= NAME_ON_CARD_LENGTH;
  const { nameOnCard, nameOnCardDD } = personalDetails;
  globals.functions.setProperty(nameOnCard, { visible: nameOnCardVisible });
  globals.functions.setProperty(nameOnCardDD, { visible: !nameOnCardVisible });

  CURRENT_FORM_CONTEXT.editFlags.nameOnCard = nameOnCardVisible;

  if (nameOnCardVisible) {
    formUtil(globals, nameOnCard).setValue(customerFullName, { attrChange: true, value: false, disable: true });
  } else {
    initializeNameOnCardDdOptions(globals, personalDetails, firstName, middleName, lastName);
  }
};

/**
*
* @name fathersNameChangeHandler
* @param {Object} globals - The global context object containing various information.
*/
const fathersNameChangeHandler = (globals) => {
  const { customerInfo } = CURRENT_FORM_CONTEXT;
  const { personalDetails } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView;

  CURRENT_FORM_CONTEXT.customerIdentityChange = true;

  const fathersNameArr = (personalDetails.fathersFullName._data.$_value || '').toUpperCase().split(' ');
  const [middleName = '', lastName = fathersNameArr[0] || ''] = fathersNameArr.length === 1 ? ['', fathersNameArr[0]] : fathersNameArr;

  const customerFullName = personalDetails?.fullName?._data?.$_value?.trim() || '';
  const isSingleName = customerFullName.split(' ').length <= 1;

  if (isSingleName) {
    Object.assign(customerInfo, {
      customerFullName: `${customerInfo.customerFirstName} ${middleName} ${lastName}`.trim().toUpperCase(),
      customerMiddleName: middleName,
      customerLastName: lastName,
    });
  }

  const nameOnCardVisible = customerInfo.customerFullName.length <= NAME_ON_CARD_LENGTH && fathersNameArr.length > 0;
  const { nameOnCard, nameOnCardDD } = personalDetails;
  globals.functions.setProperty(nameOnCard, { visible: nameOnCardVisible });
  globals.functions.setProperty(nameOnCardDD, { visible: !nameOnCardVisible });

  CURRENT_FORM_CONTEXT.editFlags.nameOnCard = nameOnCardVisible;

  if (nameOnCardVisible) {
    formUtil(globals, nameOnCard).setValue(customerInfo.customerFullName, { attrChange: true, value: false, disable: true });
  } else {
    initializeNameOnCardDdOptions(globals, personalDetails, customerInfo.customerFirstName, middleName || customerInfo.customerMiddleName, lastName || customerInfo.customerLastName);
  }
};

/**
 * checkPanValidation - Validates PAN details by calling validatePan function.
 * Increments PAN check count and validates if input is correct and check limit is not exceeded.
 * @param {string} fullName - Full name of the customer.
 * @param {string} pan - PAN number of the customer.
 * @param {object} dob - Date of birth of the customer.
 * @param {object} globals - Global object containing form and panel details.
 * @returns {Promise} - Resolves with PAN validation response or rejects with an error if inputs are invalid or check limit is exceeded.
 */
const checkPanValidation = (fullName, pan, dob, globals) => {
  const isPanValidLength = pan?.length === 12;
  const isPanCheckAllowed = CUSTOMER_DETAILS_STATE.panCheckCount <= CUSTOMER_DETAILS_STATE.maxPanCheckCount;
  const { personalDetails } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView;
  if (fullName && pan && isPanValidLength && dob && isPanCheckAllowed && !CUSTOMER_DETAILS_STATE.onLoad && CURRENT_FORM_CONTEXT?.customerInfo?.refCustItNum === '' && ageValidator(AGE_LIMIT.min, AGE_LIMIT.max, personalDetails.dateOfBirthPersonalDetails.$value)) {
    CUSTOMER_DETAILS_STATE.panCheckCount += 1;
    const mobileNumber = globals?.form?.loginMainPanel?.loginPanel?.mobilePanel?.registeredMobileNumber?.$value;
    return validatePan(mobileNumber, pan, dob, fullName, false, false);
  }

  CUSTOMER_DETAILS_STATE.onLoad = false;
  return Promise.reject(new Error('Invalid input or PAN check limit exceeded'));
};

const panvalidationSuccessHandler = (response, globals) => {
  if (response.panStatus !== 'E') {
    const panErrorText = 'Please enter a valid PAN';
    const panFieldPath = '$form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.personalDetails.panNumberPersonalDetails';

    if (CUSTOMER_DETAILS_STATE.panCheckCount < CUSTOMER_DETAILS_STATE.maxPanCheckCount) {
      globals.functions.markFieldAsInvalid(panFieldPath, panErrorText, { useQualifiedName: true });
    } else {
      const { fdBasedCreditCardWizard, resultPanel } = globals.form;
      const { errorResultPanel } = resultPanel;
      globals.functions.setProperty(fdBasedCreditCardWizard, { visible: false });
      globals.functions.setProperty(errorResultPanel.errorMessageText, { value: ERROR_MSG.invalidPan });
      globals.functions.setProperty(resultPanel, { visible: true });
      globals.functions.setProperty(errorResultPanel, { visible: true });
    }
  }
};

const addressChangeHandler = (addressLineNumber, globals) => {
  const { newCurrentAddressLine1, newCurrentAddressLine2 } = globals.form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.addressDetails.newCurentAddressPanel;
  if (newCurrentAddressLine1?._data?.$_value?.toLowerCase() === newCurrentAddressLine2?._data?.$_value?.toLowerCase()) {
    globals.functions.markFieldAsInvalid('$form.fdBasedCreditCardWizard.basicDetails.reviewDetailsView.addressDetails.newCurentAddressPanel.newCurrentAddressLine2', ERROR_MSG.matchingAddressLine, { useQualifiedName: true });
  }
};

export {
  bindCustomerDetails,
  validateEmailID,
  channelChangeHandler,
  dsaCodeHandler,
  branchCodeHandler,
  dobChangeHandler,
  fathersNameChangeHandler,
  fullNameChangeHandler,
  checkPanValidation,
  panvalidationSuccessHandler,
  addressChangeHandler,
};
