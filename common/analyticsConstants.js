const data = {
  getOTP: {
    linkType: 'button',
    StepName: 'Identify Yourself',
  },
  submittOTP: {
    error: '',
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
      gender: '',
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
      emailID: '',
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
  data,
  ANALYTICS_DATA_OBJECT,
};
