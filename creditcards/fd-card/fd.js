import groupCharacters from '../../common/common-fn.js';

const addGaps = () => {
  const inputField = document.querySelector('.char-gap-4 input');
  groupCharacters(inputField, 4);
};

export default addGaps;
