// DOM - UTILS - having cer tain dom overing function which has been used in formutils.js by the imported
// and got declared in constant name as - DOM_API.
// search with key - DOM_API to track of all dom function to track in formutils which is used over all the functions.

/**
   * Groups characters in an input field, adding a space after every specified number of characters.
   *
   * @param {HTMLInputElement} inputField - The input field element whose value is to be formatted.
   * @param {number[]} gapLengths - An array of integers representing the lengths of groups between gaps.
   */
const groupCharacters = (inputField, gapLengths) => {
  const value = inputField.value.replace(/\s+/g, '');
  let formattedValue = '';
  let position = 0;
  let gapsIndex = 0;
  let gapPosition = gapLengths[gapsIndex] || Infinity;

  for (let i = 0; i < value.length; i += 1) {
    if (position === gapPosition) {
      formattedValue += ' ';
      gapsIndex += 1;
      gapPosition = gapLengths[gapsIndex] || Infinity;
      position = 0;
    }
    formattedValue += value[i];
    position += 1;
  }

  inputField.value = formattedValue;
};

/**
   * Validates and formats a phone number input field.
   *
   * @param {HTMLInputElement} inputField - The input field element containing the phone number.
   * @param {number[]} validStartingDigits - An array of valid starting digits for the phone number.
   */
const validatePhoneNumber = (inputField, validStartingDigits) => {
  let { value } = inputField;

  // Ensure the input starts with a valid digit
  if (value.length > 0 && !validStartingDigits.includes(value[0])) {
    inputField.value = '';
    return;
  }

  // Remove invalid characters (non-digits) from the entire input
  value = value.replace(/\D/g, '');

  // Check if all 10 characters would be the same
  if (value.length === 10) {
    const isAllSame = value.split('').every((digit) => digit === value[0]);
    if (isAllSame) {
      value = value.slice(0, 9); // Remove the last character to avoid all being the same
    } else {
      const firstNine = value.slice(0, 9);
      const lastDigit = value[9];
      if (firstNine.split('').every((digit) => digit === lastDigit)) {
        value = value.slice(0, 9); // Remove the last character if it's the same as the previous 9
      }
    }
  }
  inputField.value = value;
};

const validatePanInput = (panNumber) => {
  if (panNumber.length <= 5) {
    if (/^[a-zA-Z]+$/.test(panNumber) && (panNumber.length !== 4 || panNumber[3].toLowerCase() === 'p')) {
      return true;
    }
    return false;
  } if (panNumber.length <= 9) {
    return /^[a-zA-Z]{5}\d{0,4}$/.test(panNumber);
  } if (panNumber.length >= 10) {
    return /^[a-zA-Z]{3}[pP][a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/.test(panNumber);
  }
  return true;
};

const validateTextInputOnPaste = (inputField, fieldRegex) => {
  const { value } = inputField;
  if (!fieldRegex.test(value)) {
    inputField.value = '';
  }
};

export function imageClickable(selector, url, target) {
  const element = document.querySelector(selector);
  if (element) {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      window.open(url, target);
    });
  }
}

export {
  groupCharacters,
  validatePhoneNumber,
  validatePanInput,
  validateTextInputOnPaste,
};
