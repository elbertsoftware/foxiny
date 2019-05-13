// @floww

import { validateIsEmpty } from "../validation";

const validateIsSmallerThanX = (price, x = 0) => {
  if (price <= x) {
    throw new Error("Invalid input");
  }
  return price;
};

const validateProductAttribute = attribute => {
  const newData = {};

  newData.attributeName = validateIsEmpty(attribute.attributeName);
  newData.value = validateIsEmpty(attribute.value);

  return newData;
};

const validateProducts = product => {
  const newData = {};

  newData.productName = validateIsEmpty(product.productName);
  newData.listPrice = validateIsSmallerThanX(product.listPrice);
  newData.sellPrice = validateIsSmallerThanX(product.sellPrice);
  newData.stockQuantity = validateIsSmallerThanX(product.stockQuantity, 1);
  newData.attributes = product.attributes.map(attribute => validateProductAttribute(attribute));

  return newData;
};

const validateCreateNewProductInput = data => {
  const newData = {};

  if (!data) {
    throw new Error("Invalid input");
  }

  if (!data.categoryIds || data.categoryIds.length === 0) {
    throw new Error("Invalid input");
  }

  if (!data.products || data.products.length === 0) {
    throw new Error("Invalid input");
  }

  newData.name = validateIsEmpty(data.name);
  newData.briefDescription = validateIsEmpty(data.briefDescription);
  newData.categoryIds = data.categoryIds;
  newData.detailDescription = data.detailDescription;
  newData.products = data.products.map(product => validateProducts(product));

  return newData;
};

export { validateCreateNewProductInput };
