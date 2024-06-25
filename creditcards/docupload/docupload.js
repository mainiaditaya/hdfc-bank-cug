/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import {
  displayLoader,
  hideLoaderGif,
  chainedFetchAsyncCall,
} from '../../common/makeRestAPI.js';
import { urlPath } from '../../common/formutils.js';
import createDocPayload from './docuploadutils.js';

import * as CONSTANT from '../../common/constants.js';

const { ENDPOINTS } = CONSTANT;
/**
 * documentUpload
 * @param {object} globals - The global object containing necessary globals form data
 */
const documentUpload = async (globals) => {
  const fsId = '1_FS';
  const bsId = '1_BS';
  const {
    selectKycPanel: {
      docUploadETBFlow: { DocUploadFront, DocUploadBack, docUploadDropdown },
    },
  } = globals.form.corporateCardWizardView;
  const docType = docUploadDropdown.$value;
  const frontDoc = {
    docValue: DocUploadFront,
    docType,
    fileId: fsId,
  };
  const backDoc = {
    docValue: DocUploadBack,
    docType,
    fileId: bsId,
  };
  const apiEndPoint = urlPath(ENDPOINTS.docUpload);
  const method = 'POST';
  try {
    displayLoader();
    const fsFilePayload = await createDocPayload(frontDoc);
    const bsFilePayload = await createDocPayload(backDoc);
    if (fsFilePayload && bsFilePayload) {
      const [fsFileResponse, bsFileResponse] = await chainedFetchAsyncCall(
        apiEndPoint,
        method,
        [fsFilePayload, bsFilePayload],
        'formData',
      );
      console.log(fsFileResponse, 'fs-file-1-response');
      console.log(bsFileResponse, 'bs-file-1-response');
      hideLoaderGif();
    } else {
      throw new Error('missing payload');
    }
  } catch (error) {
    hideLoaderGif();
    console.log('errorInFilePayload');
  }
};

export default documentUpload;
