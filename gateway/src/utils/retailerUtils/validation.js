// @flow

import { validateIsEmpty, validateEmail, validatePhone } from "../validation";
import { validateAddressInput } from "../addressUtils/validation";

const validateCreateRetailerInput = data => {
  const newData = {};

  newData.businessName = validateIsEmpty(data.businessName);
  newData.businessEmail = validateEmail(data.businessEmail);
  newData.businessPhone = validatePhone(data.businessPhone);
  newData.businessAddress = validateAddressInput(data.businessAddress);

  return newData;
};

const validateUpdateRetailerInput = data => {
  const newData = {};

  newData.businessName = data.businessName
    ? validateIsEmpty(data.businessName)
    : undefined;
  newData.businessEmail = data.businessEmail
    ? validateEmail(data.businessEmail)
    : undefined;
  newData.businessPhone = data.businessPhone
    ? validatePhone(data.businessPhone)
    : undefined;
  newData.businessAddress = data.businessAddress
    ? validateAddressInput(data.businessAddress)
    : undefined;

  return newData;
};

export { validateCreateRetailerInput, validateUpdateRetailerInput };
