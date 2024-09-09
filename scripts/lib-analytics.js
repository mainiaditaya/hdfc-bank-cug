/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global alloy */

/**
 * Customer's XDM schema namespace
 * @type {string}
 */
const DEV_DATA_STREAM_ID = 'bcc54d12-a918-4471-b671-5af1141b5a55'; /* your dev datastream id here */
const STAGE_DATA_STREAM_ID = 'bcc54d12-a918-4471-b671-5af1141b5a55'; /* your stage datastream id here */
const PROD_DATA_STREAM_ID = 'bcc54d12-a918-4471-b671-5af1141b5a55'; /* your prod datastream id here */
const CUSTOMER_ADOBE_ORGID = '3817033753EE89720A490D4D@AdobeOrg'; /* your ims org id here */
const CUSTOMER_DOMAIN_NAME = 'hdfc.com'; /* your domain name here */

/**
 * Returns script that initializes a queue for each alloy instance,
 * in order to be ready to receive events before the alloy library is loaded
 * Documentation
 * https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/installing-the-sdk.html?lang=en#adding-the-code
 * @type {string}
 */
const getAlloyInitScript = () => `!function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||[]).push(o),n[o]=
  function(){var u=arguments;return new Promise(function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}(window,["alloy"]);`;

/**
 * Returns datastream id to use as edge configuration id
 * Custom logic can be inserted here in order to support
 * different datastream ids for different environments (non-prod/prod)
 * @returns {{datastreamId: string, orgId: string}}
 */
const getDatastreamConfiguration = () => {
  const { hostname } = window.location;
  let datastreamId = DEV_DATA_STREAM_ID;
  if (hostname?.endsWith(CUSTOMER_DOMAIN_NAME)) {
    datastreamId = PROD_DATA_STREAM_ID;
  }
  if (hostname?.endsWith('hlx.page') || hostname?.endsWith('hlx.live')) {
    datastreamId = STAGE_DATA_STREAM_ID;
  }

  return {
    datastreamId,
    orgId: CUSTOMER_ADOBE_ORGID,
  };
};

/**
 * Returns alloy configuration
 * Documentation https://experienceleague.adobe.com/docs/experience-platform/edge/fundamentals/configuring-the-sdk.html
 */
const getAlloyConfiguration = (document) => ({
  // enable while debugging
  debugEnabled: document.location.hostname.startsWith('localhost'),
  // disable when clicks are also tracked via sendEvent with additional details
  clickCollectionEnabled: true,
  // adjust default based on customer use case
  defaultConsent: 'in', // 'in' or 'out' or 'pending'
  ...getDatastreamConfiguration(),
});

/**
 * Create inline script
 * @param document
 * @param element where to create the script element
 * @param innerHTML the script
 * @param type the type of the script element
 * @returns {HTMLScriptElement}
 */
const createInlineScript = (document, element, innerHTML, type) => {
  const script = document.createElement('script');
  if (type) {
    script.type = type;
  }
  script.innerHTML = innerHTML;
  element.appendChild(script);
  return script;
};

/**
 * Sends an analytics event to alloy
 * @param xdmData - the xdm data object
 * @returns {Promise<*>}
 */
const sendAnalyticsEvent = async (xdmData) => {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    console.warn('alloy not initialized, cannot send analytics event');
    return Promise.resolve();
  }
  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: false, // set 'true' if you want to use the Javascript's sendBeacon method to send data to Adobe.
    xdm: xdmData,
  });
};

/**
 * Sets up analytics tracking with alloy (initializes and configures alloy)
 * @param document
 * @returns {Promise<void>}
 */
const setupAnalyticsTrackingWithAlloy = async (document) => {
  await import('./alloy.min.js');

  await alloy('configure', getAlloyConfiguration(document));
};

export {
  setupAnalyticsTrackingWithAlloy,
  sendAnalyticsEvent,
  createInlineScript,
  getAlloyInitScript,
};
