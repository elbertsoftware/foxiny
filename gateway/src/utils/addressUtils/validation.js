// @flow

import { validateIsEmpty } from "../validation";

const validateAddressInput = data => {
  const newData = {};

  newData.region = validateIsEmpty(data.region);
  newData.description = validateIsEmpty(data.description);
  newData.name = validateIsEmpty(data.name);
  newData.phone = validateIsEmpty(data.phone);
  newData.street = validateIsEmpty(data.street);
  newData.unit = validateIsEmpty(data.unit);
  newData.city = validateIsEmpty(data.city);
  newData.state = validateIsEmpty(data.state);
  newData.zip = validateIsEmpty(data.zip);

  return newData;
};

export { validateAddressInput };
