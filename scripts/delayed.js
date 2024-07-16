// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { corpCreditCardContext } from '../common/journey-utils.js';
import { sendAnalytics } from '../common/analytics.js';

const { currentFormContext } = corpCreditCardContext;
// Core Web Vitals RUM collection
sampleRUM('cwv');

sendAnalytics('page load', {}, 'ACQUIRED', currentFormContext);
// add more delayed functionality here
