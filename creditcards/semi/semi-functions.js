import {
  getOTPV1,
  otpValV1,
  selectTenure,
  checkELigibilityHandler,
  sortData,
  txnSelectHandler,
  changeCheckboxToToggle,
  changeWizardView,
  selectTopTxn,
  preExecution,
  radioBtnValCommit,
  semiWizardSwitch,
  assistedToggleHandler,
} from './smart-emi-functions.js';
import { invokeJourneyDropOff, invokeJourneyDropOffByParam, invokeJourneyDropOffUpdate } from '../../common/journey-utils.js';

/* load SEMI Styles- for loading semi - styles - temporary fix */
async function loadSEMIStyles() {
  if (document.querySelector('.semi-form-wrapper')) {
    document.body.classList.add('semi-form');
  }
}
window.setTimeout(() => loadSEMIStyles(), 600);

export {
  getOTPV1,
  otpValV1,
  selectTenure,
  checkELigibilityHandler,
  invokeJourneyDropOff,
  invokeJourneyDropOffByParam,
  invokeJourneyDropOffUpdate,
  sortData,
  txnSelectHandler,
  changeCheckboxToToggle,
  changeWizardView,
  selectTopTxn,
  preExecution,
  radioBtnValCommit,
  semiWizardSwitch,
  assistedToggleHandler,
};
