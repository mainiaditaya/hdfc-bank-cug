import data from './analyticsConstants.js';

const digitalDataPageLoad = {
  page: {
    pageInfo: {
      pageName: 'CORPORATE_CARD_JOURNEY',
      errorCode: '',
      errorMessage: '',
    },
  },
  user: {
    pseudoID: 'TBD',
    journeyID: '',
    journeyName: 'CORPORATE_CARD_JOURNEY',
    journeyState: '',
    casa: '',
  },
  form: {
    name: 'Corporate credit card',
  },
  card: {
    selectedCard: '',
    eligibleCard: '',
  },
};

/**
 * send analytics call for click event
 * @name sendGenericEvent
 * @param {string} linkName - linkName
 * @param {string} linkType - linkName
 * @param {object} formContext - currentFormContext.
 * @param {object} digitalData
 */

function sendGenericClickEvent(linkName, linkType, formContext, digitalData) {
  const digitalDataEvent = digitalData || {};
  digitalDataEvent.link = {
    linkName,
    linkType,
  };
  digitalDataEvent.user.journeyID = formContext?.currentFormContext?.journeyID;
  digitalDataEvent.user.journeyState = formContext?.currentFormContext?.journeyState;
  window.digitalData = digitalDataEvent || {};
  // eslint-disable-next-line no-undef
  _satellite.track('event');
}

const getValidationMethod = (formContext) => {
  if (formContext && formContext?.login && formContext.login.panDobSelection) {
    return formContext.login.panDobSelection === '0' ? 'DOB' : 'PAN';
  }
  return '';
};

/**
 *Creates digital data for otp click event.
 * @param {string} phone
 * @param {string} validationType
 * @param {string} linkName
 * @param {object} formContext
 * @param {object} digitalData
 */
function sendSubmitClickEvent(phone, link, formContext, currentFormContext, digitalData) {
  const linkInfo = data[link];
  const digitalDataEvent = digitalData || {
    page: {
      pageInfo: {
        pageName: 'CORPORATE_CARD_JOURNEY',
        errorCode: '',
        errorMessage: '',
      },
    },
    user: {
      pseudoID: 'TBD',
      journeyID: '',
      journeyName: 'CORPORATE_CARD_JOURNEY',
      journeyState: '',
      casa: '',
      gender: '',
      email: '',
    },
    form: {
      name: 'Corporate credit card',
    },
    link: {
      linkName: '',
      linkType: '',
      linkPosition: 'form',
    },
    event: {
      phone: '',
      validationMethod: '',
      status: '',
      rating: '',
    },
    formDetails: {
      employmentType: '',
      companyName: '',
      designation: '',
      relationshipNumber: '',
      pincode: '',
      city: '',
      state: '',
      KYCVerificationMethod: '',
      languageSelected: '',
      reference: '',
      isVideoKYC: '',
    },
    card: {
      selectedCard: '',
      eligibleCard: '',
      annualFee: '',
    },
  };
  sendGenericClickEvent(linkInfo.linkName, linkInfo.linkType, currentFormContext, digitalDataEvent);
  switch (link) {
    case 'getOTP': {
      digitalDataEvent.event = {
        phone,
        validationMethod: getValidationMethod(formContext),
      };
      break;
    }
    case 'checkOffers': {
      digitalDataEvent.user = {
        gender: 'Male',
        email: 'hardcodedMailId@gmail.com',
      };
      if (formContext.form.currentAddressToggle === 'off') {
        digitalDataEvent.formDetails = {
          pincode: currentFormContext.breDemogResponse.VDCUSTZIPCODE,
          city: currentFormContext.breDemogResponse.VDCUSTCITY,
          state: currentFormContext.breDemogResponse.VDCUSTSTATE,
        };
      } else {
        const isETB = currentFormContext.journeyType === 'ETB';
        digitalDataEvent.formDetails = {
          pincode: isETB ? formContext.form.newCurentAddressPin : formContext.form.currentAddresPincodeNTB,
          city: isETB ? 'hardcodedETBCity' : 'hardcodedNTBCity',
          state: isETB ? 'hardcodedETBState' : 'hardcodedNTBState',
        };
      }
      Object.assign(digitalDataEvent.formDetails, {
        employmentType: formContext.form.employmentType,
        companyName: formContext.form.companyName,
        designation: formContext.form.designation,
        relationshipNumber: formContext.form.relationshipNumber,
      });
      break;
    }

    case 'getThisCard': {
      digitalDataEvent.card = {
        selectedCard: formContext.form.productCode,
        annualFee: formContext.form.joiningRenewalFee,
      };
      digitalDataEvent.event = {
        status: formContext.cardBenefitsAgreeCheckbox,
      };
      break;
    }
    default: {
      /* empty */
    }
  }
  window.digitalData = digitalDataEvent || {};
  // eslint-disable-next-line no-undef
  _satellite.track('submit');
}

/**
 * Sends analytics event on page load.
 * @name sendPageloadEvent
 * @param {object} formContext.
 */
function sendPageloadEvent(formContext) {
  digitalDataPageLoad.user.journeyID = formContext.journeyID;
  digitalDataPageLoad.user.journeyState = formContext?.journeyState || 'CUSTOMER_IDENTITY_UNRESOLVED';
  digitalDataPageLoad.user['Journey Name'] = 'CORPORATE_CARD_JOURNEY';
  if (window) {
    window.digitalData = digitalDataPageLoad || {};
  }
  // eslint-disable-next-line no-undef
  _satellite.track('pageload');
}

function populateResponse(payload, action, digitalDataEvent) {
  switch (action) {
    case 'getOTP': {
      digitalDataEvent.page.pageInfo.errorCode = payload?.status?.errorCode;
      digitalDataEvent.page.pageInfo.errorMessage = payload?.status?.errorMessage;
      break;
    }
    case 'checkOffers':
    case 'getThisCard': {
      digitalDataEvent.page.pageInfo.errorCode = payload?.errorCode;
      digitalDataEvent.page.pageInfo.errorMessage = payload?.errorMessage;
      break;
    }
    default: {
      /* empty */
    }
  }
}

/**
 * Send analytics events.
 * @param {object} payload
 * @param {object} formData
 */
function sendAnalyticsEvent(payload, formData, currentFormContext) {
  const action = currentFormContext?.action;
  const digitalDataEvent = {
    page: {
      pageInfo: {
        pageName: 'CORPORATE_CARD_JOURNEY',
        errorCode: '',
        errorMessage: '',
      },
    },
    user: {
      pseudoID: 'TBD',
      journeyID: '',
      journeyName: 'CORPORATE_CARD_JOURNEY',
      journeyState: '',
      casa: '',
      gender: '',
      email: '',
    },
    form: {
      name: 'Corporate credit card',
    },
    link: {
      linkName: '',
      linkType: '',
      linkPosition: 'form',
    },
    event: {
      phone: '',
      validationMethod: '',
      status: '',
      rating: '',
    },
    formDetails: {
      employmentType: '',
      companyName: '',
      designation: '',
      relationshipNumber: '',
      pincode: '',
      city: '',
      state: '',
      KYCVerificationMethod: '',
      languageSelected: '',
      reference: '',
      isVideoKYC: '',
    },
    card: {
      selectedCard: '',
      eligibleCard: '',
      annualFee: '',
    },
  };
  const apiResponse = JSON.parse(payload || {});
  populateResponse(apiResponse, action, digitalDataEvent);
  sendSubmitClickEvent(formData?.login?.registeredMobileNumber, action, formData, currentFormContext, digitalDataEvent);
  if (action === 'checkOffers') {
    digitalDataPageLoad.card.selectedCard = currentFormContext.productCode;
    digitalDataPageLoad.card.eligibleCard = currentFormContext.productCode;
    sendPageloadEvent();
  }
}

export {
  digitalDataPageLoad,
  sendPageloadEvent,
  sendSubmitClickEvent,
  sendGenericClickEvent,
  sendAnalyticsEvent,
};
