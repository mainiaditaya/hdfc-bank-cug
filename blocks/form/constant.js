export const fileAttachmentText = 'Upload';
export const dragDropText = 'Drag and Drop To Upload';

export const defaultErrorMessages = {
  accept: 'The specified file type not supported.',
  maxFileSize: 'File too large. Reduce size and try again.',
  maxItems: 'Specify a number of items equal to or less than $0.',
  minItems: 'Specify a number of items equal to or greater than $0.',
};

let submitBaseUrl = 'https://applyonlinedev.hdfcbank.com';

export function setSubmitBaseUrl(url) {
  submitBaseUrl = url;
}

export function getSubmitBaseUrl() {
  return submitBaseUrl;
}

export const formIdPathMapping = {
  '/content/forms/af/rae/f1': '../../../myforms/f1/functions.js',
  '/content/forms/af/rae/f2': '../../../myforms/f2/functions.js',
};
