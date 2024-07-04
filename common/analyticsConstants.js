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
      linkClicks: {
        value: 1,
      },
      name: '',
      type: '',
    },
  },
  _hdfcbank: {
    campaign: {
      channelSource: '',
      mcId: '',
      resulticksPersonalizationData: '',
      trackingCode: {
        utmCampaign: '',
        utmContent: '',
        utmCreative: '',
        utmMedium: '',
        utmSource: '',
        utmTerm: '',
      },
    },
    error: {
      aPIRetry: '',
      errorAPI: '',
      errorCode: '',
      errorMessage: '',
    },
    identifier: {
      emailID: '',
      marketingCloudID: '',
      mobileHash: '',
      mobileHashE164: '',
      PreAuthMobileHash: '',
      PreAuthMobileHashE164: '',
      pseudoID: '',
    },
    interaction: {
      assistedCampaignJourney: '',
      linkName: '',
      linkPageName: '',
    },
    journey: {
      amountSelected: '',
      cASACustomer: '',
      eligibleOffers: '',
      formloginverificationmethod: '',
      formEmploymentType: '',
      formLocationCity: '',
      formLocationPincode: '',
      formLocationState: '',
      formOfferedLoan: '',
      formRateofInterest: '',
      formStepsuccess: '',
      formVisitCount: '',
      formVisitNumber: '',
      gender: '',
      interestRate: '',
      journeyID: '',
      journeyID_State: '',
      journeyInformation: '',
      journeyName: '',
      journeyState: '',
      leadType: '',
      newCardType: '',
    },
    page: {
      DestinationLink: '',
      newrepeat: '',
      platform: '',
      sessionRestored: '',
      uRL: '',
    },
  },
};

export {
  data,
  ANALYTICS_DATA_OBJECT,
};
