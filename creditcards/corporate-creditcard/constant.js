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

const ANALYTICS_DATA_OBJECT = {
  eventType: '',
  web: {
    webInteraction: {
      name: '',
      type: '',
      linkClicks: {
        value: 1,
      },
    },
  },
  _hdfcbank: {
    page: {
      uRL: '',
      platform: '',
      newrepeat: '',
      DestinationLink: '',
      sessionRestored: '',
    },
    error: {
      aPIRetry: '',
      errorAPI: '',
      errorCode: '',
      errorMessage: '',
    },
    journey: {
      leadType: '',
      journeyID: '',
      journeyName: '',
      newCardType: '',
      cASACustomer: '',
      interestRate: '',
      journeyState: '',
      amountSelected: '',
      eligibleOffers: '',
      formVisitCount: '',
      formOfferedLoan: '',
      formStepsuccess: '',
      formVisitNumber: '',
      journeyID_State: '',
      formRateofInterest: '',
      journeyInformation: '',
      formloginverificationmethod: '',
    },
    campaign: {
      mcId: '',
      trackingCode: {
        utmTerm: '',
        utmMedium: '',
        utmSource: '',
        utmContent: '',
        utmCampaign: '',
        utmCreative: '',
      },
      channelSource: '',
      resulticksPersonalizationData: '',
    },
    identifier: {
      pseudoID: '',
      mobileHash: '',
      mobileHashE164: '',
      marketingCloudID: '',
      PreAuthMobileHash: '',
      PreAuthMobileHashE164: '',
    },
    interaction: {
      linkName: '',
      linkPageName: '',
      assistedCampaignJourney: '',
    },
  },
};

export {
  JOURNEY_NAME,
  DEAD_PAN_STATUS,
  ID_COM,
  ANALYTICS_DATA_OBJECT,
};
