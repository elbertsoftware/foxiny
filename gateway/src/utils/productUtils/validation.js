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

  newData.attributeName = validateIsEmpty(attribute.attributeName).toLowerCase();
  newData.value = validateIsEmpty(attribute.value).toLowerCase();

  return newData;
};

const validateProduct = product => {
  const newData = {};

  // if (!product.productMediaIds || product.productMediaIds.length === 0) {
  //   throw new Error("Invalid input");
  // }

  newData.productName = validateIsEmpty(product.productName).toLowerCase();
  newData.listPrice = validateIsSmallerThanX(product.listPrice);
  newData.sellPrice = validateIsSmallerThanX(product.sellPrice);
  newData.stockQuantity = validateIsSmallerThanX(product.stockQuantity, 1);
  newData.attributes = product.attributes.map(attribute => validateProductAttribute(attribute));
  newData.productMediaIds = product.productMediaIds;

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

  newData.name = validateIsEmpty(data.name).toLowerCase();
  newData.briefDescription = validateIsEmpty(data.briefDescription);
  newData.categoryIds = data.categoryIds;
  newData.detailDescription = data.detailDescription;
  newData.products = data.products.map(product => validateProduct(product));

  return newData;
};

export { validateCreateNewProductInput };
