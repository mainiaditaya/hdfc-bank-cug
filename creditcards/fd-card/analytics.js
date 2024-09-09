import { CUSTOM_SCHEMA_NAMESPACE } from '../../common/constants.js';
import { sendAnalyticsEvent } from '../../scripts/lib-analytics.js';

const getValidationMethod = (formContext) => {
  if (formContext && formContext?.form?.login && formContext?.form?.login?.panDobSelection) {
    return formContext.form.login.panDobSelection === '0' ? 'DOB' : 'PAN';
  }
  return '';
};

/**
 * Basic tracking for page views with alloy
 * @param document
 * @param additionalXdmFields
 * @returns {Promise<*>}
 */
const analyticsTrackPageLoad = async (document, additionalXdmFields = {}) => {
  const xdmData = {
    eventType: 'web.webinteraction.linkClicks',
    web: {
      webPageDetails: {
        pageViews: {
          value: 1,
        },
        name: `${document.title}`,
        URL: `${document.URL}`,
      },
    },
    [CUSTOM_SCHEMA_NAMESPACE]: {
      ...additionalXdmFields,
    },
  };

  return sendAnalyticsEvent(xdmData);
};

const analyticsTrackButtonClick = async (eventName, payload, formData, formContext, linkType = 'button', additionalXdmFields = {}) => {
  const jsonString = JSON.stringify(payload || {});
  const apiResponse = JSON.parse(jsonString);

  const xdmData = {
    eventType: 'web.webinteraction.linkClicks',
    web: {
      webInteraction: {
        name: eventName,
        linkClicks: {
          value: 1,
        },
        type: linkType,
      },
    },
    [CUSTOM_SCHEMA_NAMESPACE]: {
      error: {
        errorMessage: apiResponse?.otpGenResponse?.status?.errorMsg,
        errorCode: apiResponse?.otpGenResponse?.status?.errorCode,
      },
      form: {
        name: 'Corporate credit card',
      },
      page: {
        pageName: 'CORPORATE_CARD_JOURNEY',
      },
      journey: {
        journeyID: formContext?.journeyID,
        journeyName: 'CORPORATE_CARD_JOURNEY',
        journeyState: formContext?.journeyState,
        formloginverificationmethod: getValidationMethod(formData),
      },
      identifier: {
        mobileHash: formData?.login?.registeredMobileNumber,
      },
      ...additionalXdmFields,
    },
  };

  return sendAnalyticsEvent(xdmData);
};

export {
  analyticsTrackPageLoad,
  analyticsTrackButtonClick,
};
