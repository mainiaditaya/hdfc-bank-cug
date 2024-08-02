/**
 * Groups characters in an input field, adding a space after every specified number of characters.
 *
 * @param {HTMLInputElement} inputField - The input field element to format.
 * @param {number} charGroupSize - The number of characters to group before adding a space.
 */
function groupCharacters(inputField, charGroupSize) {
  const value = inputField.value.replace(/\s+/g, ''); // Remove existing spaces
  const regex = new RegExp(`.{1,${charGroupSize}}`, 'g'); // Create a dynamic regex using the variable
  const formattedValue = value.match(regex)?.join(' ') || value; // Add space after every charGroupSize characters

  inputField.value = formattedValue;

  // Adjust the letter-spacing dynamically after formatting
  if (formattedValue.length % (charGroupSize + 1) === 0) {
    inputField.classList.add('formatted');
  } else {
    inputField.classList.remove('formatted');
  }
}

export default groupCharacters;
