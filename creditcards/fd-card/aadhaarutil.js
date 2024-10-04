import { parseCustomerAddress } from '../../common/formutils.js';
import { invokeJourneyDropOffUpdate } from './fd-journey-util.js';
import * as FD_CONSTANT from './constant.js';
import { CURRENT_FORM_CONTEXT } from '../../common/constants.js';

const aadhaarSuccessHandler = async (globals) => {
  const formData = globals.functions.exportData();
  try {
    const { addressDeclarationPanel } = globals.form;
    const {
      Address1, Address2, Address3, City, State, Zipcode,
    } = formData.aadhaar_otp_val_data.result || {};
    const {
      communicationAddress1, communicationAddress2, communicationAddress3,
      communicationCity, communicationState, comCityZip,
    } = formData?.currentFormContext?.executeInterfaceRequest?.requestString || {};
    // const isValidAadhaarPincode = await pincodeCheck(Zipcode, City, State);
    const isValidAadhaarPincode = { result: true };
    let aadhaarAddress = '';
    let parsedAadhaarAddress = '';
    let fullAadhaarAddress = [Address1, Address2, Address3, City, State, Zipcode].filter(Boolean).join(', ');
    if (isValidAadhaarPincode.result === 'true') {
      aadhaarAddress = [Address1, Address2, Address3].filter(Boolean).join(' ');
      if (aadhaarAddress.length < FD_CONSTANT.MIN_ADDRESS_LENGTH) {
        aadhaarAddress.Address2 = City;
      } else {
        parsedAadhaarAddress = parseCustomerAddress(aadhaarAddress);
        const [permanentAddress1, permanentAddress2, permanentAddress3] = parsedAadhaarAddress;

        Object.assign(formData.currentFormContext.executeInterfaceRequest.requestString, {
          permanentAddress1,
          permanentAddress2,
          permanentAddress3,
          perAddressType: '4',
        });
      }
      fullAadhaarAddress = `${parsedAadhaarAddress.join(', ')} ${City} ${State} ${Zipcode}`;
    }
    const communicationAddress = [communicationAddress1, communicationAddress2, communicationAddress3, communicationCity, communicationState, comCityZip].filter(Boolean).join(', ');

    const {
      aadhaarAddressDeclaration, currentResidenceAddressBiometricOVD, currentAddressDeclarationAadhar,
      TnCAadhaarNoMobMatchLabel, TnCAadhaarNoMobMatch, proceedFromAddressDeclarationIdcom, proceedFromAddressDeclaration,
    } = addressDeclarationPanel;

    globals.functions.setProperty(aadhaarAddressDeclaration, { visible: true });
    globals.functions.setProperty(aadhaarAddressDeclaration.aadhaarAddressPrefilled, { value: fullAadhaarAddress });
    globals.functions.setProperty(currentAddressDeclarationAadhar.currentResidenceAddressAadhaar, { value: communicationAddress });
    globals.functions.setProperty(currentResidenceAddressBiometricOVD.currentResAddressBiometricOVD, { value: communicationAddress });
    globals.functions.setProperty(addressDeclarationPanel, { visible: true });

    formData.currentFormContext.mobileMatch = formData?.aadhaar_otp_val_data?.result?.mobileValid?.toLowerCase() === 'y';
    CURRENT_FORM_CONTEXT.mobileMatch = formData.currentFormContext.mobileMatch;
    globals.functions.setProperty(proceedFromAddressDeclarationIdcom, { visible: !formData?.currentFormContext?.customerIdentityChange });
    globals.functions.setProperty(proceedFromAddressDeclaration, { visible: formData?.currentFormContext?.customerIdentityChange });

    if (formData?.aadhaar_otp_val_data?.result?.mobileValid?.toLowerCase() === 'n') {
      globals.functions.setProperty(TnCAadhaarNoMobMatchLabel, { visible: true });
      globals.functions.setProperty(TnCAadhaarNoMobMatch, { visible: true });
    }

    invokeJourneyDropOffUpdate(
      'AADHAAR_REDIRECTION_SUCCESS',
      formData?.loginPanel?.mobilePanel?.registeredMobileNumber,
      formData?.runtime?.leadProifileId,
      formData?.runtime?.leadProifileId?.journeyId,
      globals,
    );
  } catch (ex) {
    invokeJourneyDropOffUpdate(
      'AADHAAR_REDIRECTION_FAILURE',
      formData?.loginPanel?.mobilePanel?.registeredMobileNumber,
      formData?.runtime?.leadProifileId,
      formData?.runtime?.leadProifileId?.journeyId,
      globals,
    );
  }
};
export default aadhaarSuccessHandler;
