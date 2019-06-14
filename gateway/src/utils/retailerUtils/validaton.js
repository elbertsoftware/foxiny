//@flow

import { validateIsEmpty, validateEmail, validatePhone } from "../validation";
import { validateAddressInput } from "../addressUtils/validation";

const validateCreateRetailerInput = data => {
  const newData = {};

  newData.businessName = validateIsEmpty(data.businessName);
  newData.businessEmail = validateEmail(data.businessEmail);
  newData.businessPhone = validatePhone(data.businessPhone);
  newData.businessAddress = validateAddressInput(data.businessAddress);
  newData.emailConfirmCode = validateIsEmpty(data.emailConfirmCode);
  newData.phoneConfirmCode = validateIsEmpty(data.phoneConfirmCode);

  return newData;
};

const validateUpdateRetailerInput = data => {
  const newData = {};

  newData.businessName = validateIsEmpty(data.businessName);
  newData.businessEmail = validateEmail(data.businessEmail);
  newData.businessPhone = validatePhone(data.businessPhone);
  newData.businessAddress = validateAddressInput(data.businessAddress);
  newData.emailConfirmCode = validateIsEmpty(data.emailConfirmCode);
  newData.phoneConfirmCode = validateIsEmpty(data.phoneConfirmCode);

  return newData;
};

export { validateCreateRetailerInput };
