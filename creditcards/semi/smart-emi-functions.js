import { displayLoader, fetchJsonResponse } from '../../common/makeRestAPI.js';
import * as SEMI_CONSTANT from './constant.js';
import {
  clearString,
  generateUUID, moveWizardView, urlPath,
} from '../../common/formutils.js';

const {
  CURRENT_FORM_CONTEXT: currentFormContext,
  JOURNEY_NAME: journeyName,
  SEMI_ENDPOINTS: semiEndpoints,
  PRO_CODE,
  DOM_ELEMENT: domElements,
  MISC,
} = SEMI_CONSTANT;

const runtimeData = {};

/**
 * function sorts the billed / Unbilled Txn  array in ascending order based on the amount field
 *
 * @param {object} data
 * @returns {object}
 */
const sortDataByAmount = (data) => data.sort((a, b) => b.aem_TxnAmt - a.aem_TxnAmt);

/**
 * Description placeholder
 *
 * @param {*} data
 * @returns {*}
 */
function sortByDate(data) {
  return data.sort((a, b) => {
    // Split the date strings into day, month, and year
    const [dayA, monthA, yearA] = a.aem_TxnDate.split('-').map(Number);
    const [dayB, monthB, yearB] = b.aem_TxnDate.split('-').map(Number);

    // Create Date objects from the components
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    // Compare the dates
    return dateA - dateB;
  });
}

/**
   * generates the journeyId
   * @param {string} visitMode - The visit mode (e.g., "online", "offline").
   * @param {string} journeyAbbreviation - The abbreviation for the journey.
   * @param {string} channel - The channel through which the journey is initiated.
   */
// eslint-disable-next-line no-unused-vars
function generateJourneyId(visitMode, journeyAbbreviation, channel) {
  const dynamicUUID = generateUUID();
  const journeyId = `${dynamicUUID}_01_${journeyAbbreviation}_${visitMode}_${channel}`;
  return journeyId;
}

// Initialize all SEMI Journey Context Variables & formRuntime variables.
currentFormContext.journeyName = journeyName;
currentFormContext.journeyID = generateJourneyId('a', 'b', 'c');
currentFormContext.totalSelect = 0;

/**
 * generates the otp
 * @param {string} mobileNumber
 * @param {string} cardDigits
 * @param {object} globals
 * @return {PROMISE}
 */
function getOTPV1(mobileNumber, cardDigits, globals) {
  globals.functions.setProperty(globals.form.runtime.journeyId, { value: currentFormContext.journeyID });
  currentFormContext.journeyName = SEMI_CONSTANT.JOURNEY_NAME;
  const jsonObj = {
    requestString: {
      mobileNo: mobileNumber,
      cardNo: cardDigits,
      journeyID: currentFormContext.journeyID,
      journeyName: currentFormContext.journeyName,
    },
  };
  const path = semiEndpoints.otpGen;
  displayLoader();
  return fetchJsonResponse(path, jsonObj, 'POST', true);
}

/**
 * generates the otp
 * @param {string} mobileNumber
 * @param {string} cardDigits
 * @param {object} globals
 * @return {PROMISE}
 */
function otpValV1(mobileNumber, cardDigits, otpNumber) {
  const jsonObj = {
    requestString: {
      mobileNo: mobileNumber,
      cardNo: cardDigits,
      OTP: otpNumber,
      proCode: PRO_CODE,
      journeyID: currentFormContext.journeyID,
      journeyName: currentFormContext.journeyName,
      channel: 'WhatsApp',
    },
  };
  const path = semiEndpoints.otpVal;
  displayLoader();
  return fetchJsonResponse(path, jsonObj, 'POST', true);
}

/**
 * sets the data for the instance of repetable panel
 *
 * @param {object} globals - gobal form object
 * @param {Object} panel - The panel for unbilled transactions.
 * @param {Object} txn - current tramsaction object
 * @param {number} i - current instance of panel row
 */
const setData = (globals, panel, txn, i) => {
  globals.functions.setProperty(panel[i]?.aem_Txn_checkBox, { value: txn?.checkbox || txn?.aem_Txn_checkBox }); // set the checbox value
  globals.functions.setProperty(panel[i]?.aem_TxnAmt, { value: txn?.amount || txn?.aem_TxnAmt });
  globals.functions.setProperty(panel[i]?.aem_TxnDate, { value: txn?.date || txn?.aem_TxnDate });
  globals.functions.setProperty(panel[i]?.aem_TxnID, { value: txn?.id || txn?.aem_TxnID });
  globals.functions.setProperty(panel[i]?.aem_TxnName, { value: txn?.name || txn?.aem_TxnName });
};

/*
 * Displays card details by updating the UI with response data.
 * @param {object} globals - global object
 * @param {object} response - response from the checkEligibilty
 */
const cardDisplay = (globals, response) => {
  const creditCardDisplay = globals.form.aem_semicreditCardDisplay;
  globals.functions.setProperty(creditCardDisplay, { visible: true });
  globals.functions.setProperty(creditCardDisplay.aem_semicreditCardContent.aem_customerNameLabel, { value: `Dear ${response?.cardHolderName}` });
  const nfObject = new Intl.NumberFormat('hi-IN');
  // eslint-disable-next-line radix
  const totalAmt = nfObject.format(parseInt(response.responseString.creditLimit) - Math.round(parseInt(response?.blockCode?.bbvlogn_card_outst) / 100));
  globals.functions.setProperty(creditCardDisplay.aem_semicreditCardContent.aem_outStandingAmt, { value: `${MISC.rupeesUnicode} ${totalAmt}` });
  globals.functions.setProperty(globals.form.aem_semicreditCardDisplay.aem_cardfacia, { value: urlPath(response.cardTypePath) });
  const imageEl = document.querySelector('.field-aem-cardfacia > picture');
  const imagePath = `${urlPath(response.cardTypePath)}?width=2000&optimize=medium`;
  imageEl?.childNodes[5].setAttribute('src', imagePath);
  imageEl?.childNodes[3].setAttribute('srcset', imagePath);
  imageEl?.childNodes[1].setAttribute('srcset', imagePath);
};

const DELAY = 50;
const DELTA_DELAY = 70;

/**
 * Combines transaction data and updates the appropriate panels.
 *
 * @param {Array} allTxn - Array of all transactions.
 * @param {number} [btxn] - Number of billed transactions.
 * @param {Object} billedTxnPanel - The panel for billed transactions.
 * @param {Object} [unBilledTxnPanel] - The panel for unbilled transactions.
 * @param {Object} globals - Global variables and functions.
 */
const setTxnPanelData = (allTxn, btxn, billedTxnPanel, unBilledTxnPanel, globals) => {
  if (!allTxn?.length) return;
  allTxn.forEach((txn, i) => {
    const isBilled = i < btxn;
    const isFirst = i === 0;
    const isLast = i === allTxn.length - 1;
    let panel = billedTxnPanel;
    if (btxn !== undefined && unBilledTxnPanel !== undefined) {
      // Case where we have both billed and unbilled transactions
      panel = isBilled ? billedTxnPanel : unBilledTxnPanel;
    }
    const delay = DELAY + (DELTA_DELAY * i);
    const panelIndex = isBilled ? i : i - btxn;
    setTimeout(() => {
      if (isFirst || !isLast) {
        globals.functions.dispatchEvent(panel, 'addItem');
      }
      setData(globals, panel, txn, panelIndex);
    }, delay);
  });
};

/**
* @param {resPayload} Object - checkEligibility response.
* @param {object} globals - global object
* @return {PROMISE}
*/
// eslint-disable-next-line no-unused-vars
function checkELigibilityHandler(resPayload, globals) {
  const response = {};
  try {
    runtimeData.checkEligibilityResponse = resPayload;
    const ccBilledData = resPayload?.ccBilledTxnResponse?.responseString || [];
    const ccUnBilledData = resPayload?.ccUnBilledTxnResponse?.responseString || [];
    currentFormContext.txnResponse = {
      BILLED: ccBilledData,
      UNBILLED: ccUnBilledData,
    };
    const billedTxnPanel = globals.form.aem_semiWizard.aem_chooseTransactions.billedTxnFragment.aem_chooseTransactions.aem_TxnsList;
    const unBilledTxnPanel = globals.form.aem_semiWizard.aem_chooseTransactions.unbilledTxnFragment.aem_chooseTransactions.aem_TxnsList;
    const allTxn = ccBilledData.concat(ccUnBilledData);
    setTxnPanelData(allTxn, ccBilledData.length, billedTxnPanel, unBilledTxnPanel, globals);
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.aem_transactionsInfoPanel.aem_eligibleTxnLabel, { value: `Eligible Transactions (${allTxn?.length})` });
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.billedTxnFragment.aem_chooseTransactions.aem_txnHeaderPanel.aem_TxnAvailable, { value: `Billed Transaction: (${ccBilledData?.length})` });
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.unbilledTxnFragment.aem_chooseTransactions.aem_txnHeaderPanel.aem_TxnAvailable, { value: `Unbilled Transaction: (${ccUnBilledData?.length})` });
    // Display card and move wizard view
    if (window !== undefined) cardDisplay(globals, resPayload);
    if (window !== undefined) moveWizardView(domElements.semiWizard, domElements.chooseTransaction);
    response.nextscreen = 'success';
    return response;
  } catch (error) {
    response.nextscreen = 'failure';
    return response;
  }
}

/* */
// var a4 = getLoanOptionsInfo(x.response.responseString.records);
const getLoanOptionsInfo = (responseStringJsonObj) => {
  const loanOptionsInfo = {
    loanoptions: [],
  };

  // Loop through the periods, interests, and tids
  for (let i = 1; i <= 5; i++) {
    const periodKey = `period${i === 1 ? '' : i}`;
    const interestKey = `interest${i === 1 ? '' : i}`;
    const tidKey = `tid${i === 1 ? '' : i}`;

    // Check if the keys exist to avoid pushing undefined values
    if (responseStringJsonObj[0][periodKey] !== undefined) {
      loanOptionsInfo.loanoptions.push({
        period: responseStringJsonObj[0][periodKey],
        interest: responseStringJsonObj[0][interestKey],
        tid: responseStringJsonObj[0][tidKey],
      });
    }
  }
  return loanOptionsInfo.loanoptions;
};

function calculateEMI(loanAmount, rateOfInterest, tenure) {
  // optmize this later - amaini
  // [P x R x (1+R)^N]/[(1+R)^N-1]
  const newrate = (rateOfInterest / 100);
  const rate1 = (1 + newrate);
  const rate2 = rate1 ** tenure;
  const rate3 = (rate2 - 1);
  const principle = [(loanAmount) * (newrate) * rate2];
  const finalEMI = Math.round(principle / rate3);
  return finalEMI;
}

function currencyUtil(number, minimumFractionDigits) {
  if (typeof (number) !== 'number') {
    return number;
  }
  number /= 100;
  const options = {
    minimumFractionDigits: minimumFractionDigits || 0,
  };
  number = number.toFixed(minimumFractionDigits || 0);
  const newNumber = new Intl.NumberFormat('us-EN', options).format(number);
  return newNumber;
}

/* */

const LOAN_AMOUNT = 11800;

const setDataTenurePanel = (globals, panel, option, i) => {
  globals.functions.setProperty(panel[i].aem_tenureSelection, { value: option?.period });
  globals.functions.setProperty(panel[i].aem_tenureSelectionEmi, { value: Number(clearString(option?.monthlyEMI)) });
  globals.functions.setProperty(panel[i].aem_tenureSelectionProcessing, { value: option?.procesingFee });
};

const tenureOption = (loanOptions) => {
  const arrayOptions = loanOptions?.map((option) => {
    const nfObject = new Intl.NumberFormat('hi-IN');
    const roiMonthly = (parseInt(option.interest, 10) / 100) / 12;
    const roiAnnually = currencyUtil(parseFloat(option?.interest), 2);
    const monthlyEMI = nfObject.format(calculateEMI(LOAN_AMOUNT, roiMonthly, parseInt(option.period, 10)));
    const period = `${parseInt(option.period, 10)} Months`;
    const procesingFee = '500';
    return ({
      ...option,
      procesingFee,
      period,
      monthlyEMI,
      roiAnnually,
      roiMonthly,
    });
  });
  return arrayOptions;
};

/**
 * Continue button on choose transactions.
 *
 * @param {Object} globals - Global variables and functions.
 */
// eslint-disable-next-line no-unused-vars
function selectTenure(globals) {
  const loanArrayOption = getLoanOptionsInfo(runtimeData.checkEligibilityResponse?.responseString?.records);
  const tenureArrayOption = tenureOption(loanArrayOption);
  const tenureRepatablePanel = globals.form.aem_semiWizard.aem_selectTenure.aem_tenureSelectionMainPnl.aem_tenureSelectionRepeatablePanel;
  if (window !== undefined) moveWizardView(domElements.semiWizard, 'aem_selectTenure');
  tenureArrayOption?.forEach((option, i) => {
    setDataTenurePanel(globals, tenureRepatablePanel, option, i);
  });
}

/**
 * function sorts the billed / Unbilled Txn  array in based on the orderBy field
 * @param {string} txnType  - BILLED /  UNBILLED
 * @param {string} orderBy - orderby amount or date
 */
function sortData(txnType, orderBy, globals) {
  if (!txnType) return;
  // orderBy - 0 - amount ; 1 - date
  const BILLED_FRAG = 'billedTxnFragment';
  const UNBILLED_FRAG = 'unbilledTxnFragment';
  const TXN_FRAG = txnType === 'BILLED' ? BILLED_FRAG : UNBILLED_FRAG;
  const pannel = globals.form.aem_semiWizard.aem_chooseTransactions?.[`${TXN_FRAG}`].aem_chooseTransactions.aem_TxnsList;
  const billed = globals.functions.exportData().smartemi.aem_billedTxn.aem_billedTxnSelection;
  const unBilled = globals.functions.exportData().smartemi.aem_unbilledTxn.aem_unbilledTxnSection;
  const dataTxnList = txnType === 'BILLED' ? billed : unBilled;
  const sortedData = (orderBy === '0') ? sortDataByAmount(dataTxnList) : sortByDate(dataTxnList);
  sortedData?.forEach((data, i) => setData(globals, pannel, data, i));
}

/**
 * function to update number of transaction selected.
 * @param {string} checkboxVal - checkbox value
 * @param {string} txnType - BILLED /  UNBILLED
 */
function txnSelectHandler(checkboxVal, txnType, globals) {
  const MAX_SELECT = 10;
  const BILLED_FRAG = 'billedTxnFragment';
  const UNBILLED_FRAG = 'unbilledTxnFragment';
  const TXN_FRAG = txnType === 'BILLED' ? BILLED_FRAG : UNBILLED_FRAG;
  const txnList = globals.form.aem_semiWizard.aem_chooseTransactions?.[`${TXN_FRAG}`].aem_chooseTransactions.aem_TxnsList;
  const txnSelected = globals.form.aem_semiWizard.aem_chooseTransactions?.[`${TXN_FRAG}`].aem_chooseTransactions.aem_txnHeaderPanel.aem_txnSelected;
  const selectedList = txnList?.filter((el) => (el.aem_Txn_checkBox.$value === 'on'));
  globals.functions.setProperty(txnSelected, { value: selectedList?.length }); // set number of select in billed or unbilled txn list
  if ((checkboxVal === 'on') && ((txnType === 'BILLED') || (txnType === 'UNBILLED'))) {
    currentFormContext.totalSelect += 1;
  } else if ((currentFormContext.totalSelect > 0)) {
    currentFormContext.totalSelect -= 1;
  }
  const TOTAL_SELECT = `Total selected ${currentFormContext.totalSelect}/${MAX_SELECT}`;
  if (currentFormContext.totalSelect <= MAX_SELECT) {
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.aem_transactionsInfoPanel.aem_TotalSelectedTxt, { value: TOTAL_SELECT });// total no of select billed or unbilled txn list
  }
  if ((currentFormContext.totalSelect === MAX_SELECT)) {
    /* popup alert hanldles */
    const CONFIRM_TXT = 'You can select up to 10 transactions at a time, but you can repeat the process to convert more transactions into SmartEMI.';
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.aem_txtSelectionPopupWrapper, { visible: true });
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.aem_txtSelectionPopupWrapper.aem_txtSelectionPopup, { visible: true });
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.aem_txtSelectionPopupWrapper.aem_txtSelectionPopup.aem_txtSelectionConfirmation, { value: CONFIRM_TXT });
    globals.functions.setProperty(globals.form.aem_semiWizard.aem_chooseTransactions.aem_txtSelectionPopupWrapper.aem_txtSelectionPopup.aem_txtSelectionConfirmation1, { visible: true });
  }
}

function numberToText(num) {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if ((num.toString()).length > 9) return 'overflow';
  const n = (`000000000${num}`).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = '';
  str += (n[1] != 0) ? `${a[Number(n[1])] || `${b[n[1][0]]} ${a[n[1][1]]}`}Crore ` : '';
  str += (n[2] != 0) ? `${a[Number(n[2])] || `${b[n[2][0]]} ${a[n[2][1]]}`}Lakh ` : '';
  str += (n[3] != 0) ? `${a[Number(n[3])] || `${b[n[3][0]]} ${a[n[3][1]]}`}Thousand ` : '';
  str += (n[4] != 0) ? `${a[Number(n[4])] || `${b[n[4][0]]} ${a[n[4][1]]}`}Hundred ` : '';
  str += `₹${n[5] != 0}` ? `${a[Number(n[5])] || `${b[n[5][0]]} ${a[n[5][1]]}`}Only ` : '';
  return str;
}

export {
  getOTPV1,
  otpValV1,
  checkELigibilityHandler,
  selectTenure,
  sortData,
  txnSelectHandler,
};
