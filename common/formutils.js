/* eslint-disable no-underscore-dangle */
// declare-CONSTANTS
const DEFAULT_BASE_PATH = 'https://applyonlinedev.hdfcbank.com'; // baseApiUrl for default
const DATA_ATTRIBUTE_EMPTY = 'data-empty';
const ANCESTOR_CLASS_NAME = 'field-wrapper';

/**
 * Generates the full API path based on the environment.
 * @param {string} uri - The endpoint to be appended to the base URL.
 * @returns {string} - The complete API URL including the base URL and the provided endpoint.
 */

const urlPath = (path) => `${DEFAULT_BASE_PATH}${path}`;

/**
 * Masks a number by replacing the specified number of leading digits with asterisks.
 * @param {number} number - The number to mask.
 * @param {number} digitsToMask - The number of leading digits to mask.
 * @returns {string} -The masked number as a string.
 */

const maskNumber = (number, digitsToMask) => {
  if (!number || Number.isNaN(number)) return '******';
  const regex = new RegExp(`^(\\d{${digitsToMask}})`);
  return number.toString().replace(regex, '*'.repeat(digitsToMask));
};

/**
 * Removes spaces and special characters from a given string.
 * @param {string} str - The input string to be cleaned
 * @returns {string} - The input string with spaces and special characters removed.
 */
const clearString = (str) => (str ? str?.replace(/[\s~`!@#$%^&*(){}[\];:"'<,.>?/\\|_+=-]/g, '') : '');

/**
 * Makes a form field invalid by adding error message and styling through Dom api.
 * If the field already has an error message element, updates its content.
 * If not, creates a new error message element.
 * @param {string} fieldName - The name attribute of the field to make invalid.
 * @param {string} [invalidMsg] - The error message to display. Optional, defaults to an empty string.
 */
const makeFieldInvalid = (fieldName, invalidMsg) => {
  const fieldDescClass = 'field-description';
  const invalidClass = 'field-invalid';
  const invalidPin = document.querySelector(`[name=${fieldName}]`);
  const parentElement = invalidPin?.parentElement;
  if (parentElement) {
    const fd = parentElement?.querySelector(`.${fieldDescClass}`);
    if (fd) {
      fd.textContent = invalidMsg || '';
    } else {
      parentElement?.classList.add(invalidClass);
      const fieldDesc = document.createElement('div');
      fieldDesc.textContent = invalidMsg || '';
      fieldDesc.classList.add(fieldDescClass);
      parentElement.appendChild(fieldDesc);
    }
  }
};

/**
 * Utility function for managing properties of a panel.
 * @param {object} globalObj - The global object containing functions.
 * @param {object} panelName - The name of the panel to manipulate.
 * @returns {void}
 */

const formUtil = (globalObj, panelName) => ({
  /**
    * Sets the visibility of the panel.
    * @param {boolean} val -The visibility value to set.
    * @returns {void}
    */
  visible: (val) => {
    globalObj.functions.setProperty(panelName, { visible: val });
  },
  /**
    * Sets the enabled/disabled state of the panel.
    * @param {boolean} val -The enabled/disabled value to set.
    * @returns {void}
    */

  enabled: (val) => {
    globalObj.functions.setProperty(panelName, { enabled: val });
  },
  /**
 * Sets the value of a panel and updates the data attribute if specified.
 * @param {any} val - The value to set for the panel.
 * @param {Object} changeDataAttr - An object containing information about whether to change the data attribute.
 * @param {boolean} changeDataAttr.attrChange - Indicates whether to change the data attribute.
 * @param {string} changeDataAttr.value - The value to set for the data attribute.
 */
  setValue: (val, changeDataAttr) => {
    globalObj.functions.setProperty(panelName, { value: val });
    if (changeDataAttr?.attrChange && val) {
      const element = document.getElementsByName(panelName._data.$_name)?.[0];
      if (element) {
        const closestAncestor = element.closest(`.${ANCESTOR_CLASS_NAME}`);
        if (closestAncestor) {
          closestAncestor.setAttribute(DATA_ATTRIBUTE_EMPTY, changeDataAttr.value);
        }
      }
      if (changeDataAttr?.disable && val) {
        globalObj.functions.setProperty(panelName, { enabled: false });
      }
    }
  },
  /**
   * Sets the value of an enum field with the provided options and value.
   * @param {Array} enumOptions - An array containing the options for the enum field.
   * @param {String} val - The value to set for the enum field
   */
  setEnum: (enumOptions, val) => {
    globalObj.functions.setProperty(panelName, { enum: enumOptions, value: val }); // setting initial value among enums options
  },
  /**
   *  Resets the field by setting its value to empty and resetting floating labels.
   */
  resetField: () => {
    globalObj.functions.setProperty(panelName, { value: '' });
    const element = document.getElementsByName(panelName._data.$_name)?.[0];
    if (element) {
      const closestAncestor = element.closest(`.${ANCESTOR_CLASS_NAME}`);
      if (closestAncestor) {
        closestAncestor.setAttribute(DATA_ATTRIBUTE_EMPTY, true);
      }
    }
  },
  /**
  * Sets the fields as invalid.
  * @param {boolean} val - A boolean value indicating whether the field is valid (true) or invalid (false).
  * @param {string} [errorMsg] - An optional parameter representing the error message to be set if the field is invalid.
   */
  markInvalid: (val, errorMsg) => {
    const dispatchLoad = {};
    dispatchLoad.valid = val;
    if (errorMsg) dispatchLoad.errorMessage = errorMsg;
    globalObj.functions.setProperty(panelName, dispatchLoad);
    makeFieldInvalid(panelName?.$name, errorMsg);
  },
});

/**
 * Gets a formatted timestamp from the provided current time.
 *
 * @param {Date} currentTime The current time to generate the timestamp from.
 * @returns {string} The formatted timestamp in 'YYYYMMDDHHmmss' format.
 */
const getTimeStamp = (currentTime) => {
  // Function to pad single digit numbers with leading zero
  const pad = (number) => ((number < 10) ? `0${number}` : number);
  // Format the datetime as desired
  const formattedDatetime = currentTime.getFullYear()
    + pad(currentTime.getMonth() + 1)
    + pad(currentTime.getDate())
    + pad(currentTime.getHours())
    + pad(currentTime.getMinutes())
    + pad(currentTime.getSeconds());
  return formattedDatetime;
};

/**
 * Converts a date string from 'YYYYMMDD' format to a localized date string.
 * @param {string} date - The date string in 'YYYYMMDD' format.
 * @returns {string} The formatted date string in 'MMM DD, YYYY' format.
 */
const convertDateToMmmDdYyyy = (date) => {
  // Extract year, month, and day parts from the input date string
  const year = date.slice(0, 4);
  const month = date.slice(4, 6).padStart(2, '0'); // Ensures zero padding for single-digit months
  const day = date.slice(6, 8).padStart(2, '0'); // Ensures zero padding for single-digit days

  // Define options for the localized date string
  const options = { month: 'short', day: 'numeric', year: 'numeric' };

  // Create a new Date object and convert it to a localized date string
  return new Date(year, month - 1, day).toLocaleDateString('en-US', options);
};

/**
 * Converts a given date to the format dd/mm/yyyy.
 * @param {Date} date - The date object to be converted.
 * @returns {string} The date string in the format dd/mm/yyyy.
 */
const convertDateToDdMmYyyy = (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;
  return `${day}/${month}/${year}`;
};

/**
 * Formats a given date string according to the specified format.
 * @param {string} dateString - The date string to be formatted.
 * @param {string} format - The format to apply to the date string. Possible values are 'YYYYMMDD' and 'YYYYMMDDWithTime'.
 * @returns {string} The formatted date string based on the specified format. If the format is not recognized, returns the original dateString.
 */
const dateFormat = (dateString, format) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  if (format === 'YYYYMMDD') {
    return `${year}${month}${day}`;
  } if (format === 'YYYYMMDDWithTime') {
    return `${year}-${month}-${day} 00:00:00`;
  }
  return dateString;
};

/**
 * Sets data attribute and value on the closest ancestor element with the specified class name.
 * @param {string} elementName - The name of the element to search for.
 * @param {string} fieldValue - The value to check for existence before setting data.
 * @param {string} dataAttribute - The name of the data attribute to set.
 * @param {string} value - The value to set for the data attribute.
 * @param {string} ancestorClassName - The class name of the ancestor element where the data attribute will be set.
 */
const setDataAttributeOnClosestAncestor = (elementName, fieldValue, dataAttribute, value, ancestorClassName) => {
  if (!fieldValue) {
    return;
  }

  // Get the element by name
  const element = document.getElementsByName(elementName)?.[0];

  // If element exists, set data attribute on the closest ancestor with the specified class name
  if (element) {
    const closestAncestor = element.closest(`.${ancestorClassName}`);
    if (closestAncestor) {
      closestAncestor.setAttribute(dataAttribute, value);
    }
  }
};

/**
 * Generates an array of objects representing different name compositions based on the provided names.
 * @param {string} fn - The first name.
 * @param {string} mn - The middle name.
 * @param {string} ln - The last name.
 * @returns {Array<Object>} -  An array of objects representing different combinations of names using the provided first name (fn), middle name (mn), and last name (ln).
 */
const composeNameOption = (fn, mn, ln) => {
  const initial = (str) => str?.charAt(0);
  const stringify = ([a, b]) => (a && b ? `${a} ${b}` : '');
  const toOption = (a) => ({ label: a, value: a });
  const MAX_LENGTH = 19;
  const names = [
    [fn, initial(mn)],
    [fn, mn],
    [mn, fn],
    [mn, initial(fn)],
    [initial(mn), fn],
    [fn, ln],
    [mn, ln],
    [initial(mn), ln],
  ]?.map(stringify)?.filter((el) => el?.length <= MAX_LENGTH);
  return [...new Set(names)]?.map(toOption);
};

/**
 * Sets the options of a select element based on the provided option lists.
 * @param {Array<object>} optionLists - An array of objects representing the options to be set.
 * @param {string} elementName - The name attribute of the select element.
 */
const setSelectOptions = (optionLists, elementName) => {
  const selectOption = document.querySelector(`[name=${elementName}]`);
  optionLists?.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option?.value;
    optionElement.textContent = option?.label;
    const parent = selectOption?.parentNode;
    selectOption?.appendChild(optionElement);
    parent?.setAttribute('data-active', true);
  });
};

/**
 * Parses the given address into substrings, each containing up to 30 characters.
 * @param {string} address - The address to parse.
 * @returns {string[]} An array of substrings, each containing up to 30 characters.
 */
const parseCustomerAddress = (address) => {
  const words = address.trim().split(' ');
  const substrings = [];
  let currentSubstring = '';

  words.forEach((word) => {
    if (substrings.length === 3) {
      return; // Exit the loop if substrings length is equal to 3
    }
    if ((`${currentSubstring} ${word}`).length <= 30) {
      currentSubstring += (currentSubstring === '' ? '' : ' ') + word;
    } else {
      substrings.push(currentSubstring);
      currentSubstring = word;
    }
  });

  return substrings;
};

/**
 * Moves the corporate card wizard view from one step to the next step.
 * @param {String} source - The name attribute of the source element (parent wizard panel).
 * @param {String} target - The name attribute of the destination element.
 */
const moveWizardView = (source, target) => {
  const navigateFrom = document.getElementsByName(source)?.[0];
  const current = navigateFrom?.querySelector('.current-wizard-step');
  const currentMenuItem = navigateFrom?.querySelector('.wizard-menu-active-item');
  const navigateTo = document.getElementsByName(target)?.[0];
  current?.classList?.remove('current-wizard-step');
  navigateTo?.classList?.add('current-wizard-step');
  // add/remove active class from menu item
  const navigateToMenuItem = navigateFrom?.querySelector(`li[data-index="${navigateTo?.dataset?.index}"]`);
  currentMenuItem?.classList?.remove('wizard-menu-active-item');
  navigateToMenuItem?.classList?.add('wizard-menu-active-item');
  const event = new CustomEvent('wizard:navigate', {
    detail: {
      prevStep: { id: current?.id, index: parseInt(current?.dataset?.index || 0, 10) },
      currStep: { id: navigateTo?.id, index: parseInt(navigateTo?.dataset?.index || 0, 10) },
    },
    bubbles: false,
  });
  navigateFrom?.dispatchEvent(event);
};

/**
 * Removes special characters from a string, except those specified in the allowed characters string.
 *
 * @param {string} str - The input string from which special characters will be removed.
 * @param {string} allowedChars - A string containing characters that are allowed to remain in the output string.
 * @returns {string} The input string with all special characters removed, except those specified in allowedChars.
 */
const removeSpecialCharacters = (str, allowedChars) => {
  // Escape special characters in the allowed characters string
  const escapedAllowedChars = allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Construct regex pattern to match special characters except those in allowedChars
  const regex = new RegExp(`[^a-zA-Z0-9,${escapedAllowedChars.replace('-', '\\-')}]`, 'g');

  // Remove special characters from the input string using the regex pattern
  return str.replace(regex, '');
};

/**
   * Filters out all defined values from the form data using the globals object.
   * @param {object} globaObj- Globals variables object containing form configurations.
   * @returns {object} -Object containing only defined values.
   */
const santizedFormData = (globaObj) => JSON.parse(JSON.stringify(globaObj.functions.exportData()));

export {
  urlPath,
  maskNumber,
  clearString,
  formUtil,
  getTimeStamp,
  convertDateToMmmDdYyyy,
  setDataAttributeOnClosestAncestor,
  convertDateToDdMmYyyy,
  setSelectOptions,
  composeNameOption,
  parseCustomerAddress,
  moveWizardView,
  removeSpecialCharacters,
  dateFormat,
  makeFieldInvalid,
  santizedFormData,
};
