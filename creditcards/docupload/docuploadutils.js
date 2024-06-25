/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import { corpCreditCardContext } from '../../common/journey-utils.js';
import { generateUUID } from '../../common/formutils.js';
/**
 * Creates a FormData payload for document upload.
 *
 * @param {Object} param0 - Parameters object.
 * @param {Object} param0.docValue - Document value object containing data to upload.
 * @param {string} param0.docType - Type of the document.
 * @param {string} param0.fileId - Unique identifier for the file.
 * @returns {Promise<FormData>} FormData object containing the document payload.
 * @throws {Error} Throws an error if document creation fails.
 */
const createDocPayload = async ({ docValue, docType, fileId }) => {
  try {
    const {
      currentFormContext: {
        journeyName,
        journeyID,
        eRefNumber,
        breDemogResponse: { MOBILE },
        executeInterfaceResPayload: { applicationRefNumber },
      },
    } = corpCreditCardContext;
    const file = docValue?.$value?.data;
    const fileBinary = file;
    const documentName = file.name;
    const mobileNumber = String(MOBILE);
    const { userAgent } = window.navigator;
    const uuId = generateUUID();
    const payloadKeyValuePairs = {
      [`${uuId}`]: fileBinary,
      imageBinary: fileBinary,
      docuemntType: docType,
      journeyID,
      requestNumber: eRefNumber,
      applicationRefNo: applicationRefNumber,
      journeyName,
      mobileNumber,
      userAgent,
      docuemntName: documentName,
      fileId: uuId,
      [`existing_${fileId}`]: '',
    };
    const formData = new FormData();
    Object.entries(payloadKeyValuePairs).forEach(([key, value]) => formData.append(key?.toString(), value));
    return formData;
  } catch (error) {
    throw new Error('Failed to create document payload', error);
  }
};

export default createDocPayload;
