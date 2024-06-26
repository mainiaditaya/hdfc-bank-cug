// declare CONSTANTS for (cc) corporate credit card only.
// impoted as CC_CONSTANT key name in all files.

const JOURNEY_NAME = 'CORPORATE_CARD_JOURNEY';
const DEAD_PAN_STATUS = ['D', 'ED', 'X', 'F'];
const ID_COM = {
  productCode: 'CORPCC',
  scopeMap: {
    only_casa: {
      no: 'AACC',
      yes: 'ADOBE_PACC',
    },
    casa_asset: {
      no: 'AACC',
      yes: 'ADOBE_PACC',
    },
    casa_cc: 'PADC',
    only_cc: 'OYCC',
  },
};

export {
  JOURNEY_NAME,
  DEAD_PAN_STATUS,
  ID_COM,
};
