/* eslint-disable no-undef */
import { currentFormContext } from './journey-utils.js';

/**
 * @name setPageDetails
 * @param {string} pageName - pageName is the step-screen where user CTA happened
 * @param {object} globals - globals variables object containing form configurations.
 */
function setPageDetails(pageName) {
  // eslint-disable-next-line no-unused-vars
  const digitalData = {
    form: {
      name: currentFormContext.formName,
    },
    page: {
      pageInfo: {
        pageName,
        errorMessage: currentFormContext.errorMsg,
        errorCode: currentFormContext.errorcode,
        errorAPI: currentFormContext.lastAPICalled,
      },
    },

  };
  _satellite.track('pageload');
}

// eslint-disable-next-line import/prefer-default-export
export { setPageDetails };
