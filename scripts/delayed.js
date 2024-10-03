// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { sendPageloadEvent } from '../common/analytics.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
