// @flow

import { stringTrim, validateIsEmpty } from "../validation";
import logger from "../logger";

const validateNotSmallerThanX = (value, x = 0) => {
  if (!Number.isInteger(value) || !Number.isInteger(x)) {
    logger.error("Not integer");
    throw new Error("Invalid input");
  }

  if (!Number.isSafeInteger(value) || !Number.isSafeInteger(x)) {
    logger.error("Precision may be lost!");
    throw new Error("Invalid input");
  }

  if (value <= x) {
    logger.error("Invalid value");
    throw new Error("Invalid input");
  }

  return value;
};

const validateProductAttribute = attribute => {
  const newData = {};

  newData.attributeName = validateIsEmpty(
    attribute.attributeName,
  ).toLowerCase();
  newData.value = validateIsEmpty(attribute.value).toLowerCase();

  return newData;
};

const validateProduct = product => {
  const newData = {};

  if (!product) {
    throw new Error("Invalid input");
  }

  if (!product.attributes || product.attributes.length === 0) {
    throw new Error("Invalid input");
  }

  newData.productName = validateIsEmpty(product.productName).toLowerCase();
  newData.listPrice = validateNotSmallerThanX(product.listPrice);
  newData.sellPrice = validateNotSmallerThanX(product.sellPrice);
  newData.stockQuantity = validateNotSmallerThanX(product.stockQuantity, 1);
  newData.attributes = product.attributes.map(attribute =>
    validateProductAttribute(attribute),
  );
  newData.productMediaIds = product.productMediaIds;

  return newData;
};

const validateCreateNewProductInput = data => {
  const newData = {};

  if (!data) {
    logger.error("Invalid data object");
    throw new Error("Invalid input");
  }

  if (!data.catalogIds || data.catalogIds.length === 0) {
    logger.error("Invalid catalogIds");
    throw new Error("Invalid input");
  }

  if (!data.products || data.products.length === 0) {
    logger.error("Invalid products");
    throw new Error("Invalid input");
  }

  newData.name = validateIsEmpty(data.name).toLowerCase();
  newData.briefDescription = validateIsEmpty(data.briefDescription);
  newData.catalogIds = data.catalogIds;
  newData.brandName = validateIsEmpty(data.brandName);
  newData.detailDescription = validateIsEmpty(data.detailDescription);
  newData.products = data.products.map(product => validateProduct(product));

  return newData;
};

const validateUpdateOneProductInput = product => {
  const newData = {};

  if (!product) {
    logger.error("Invalid data object");
    throw new Error("Invalid input");
  }

  if (!product.productTemplateId) {
    logger.error("Invalid productTemplateId");
    throw new Error("Invalid input");
  }

  if (!product.productId) {
    logger.error("Invalid productId");
    throw new Error("Invalid input");
  }

  newData.productTemplateId = product.productTemplateId;
  newData.productId = product.productId;
  newData.productName = product.productName
    ? validateIsEmpty(product.productName).toLowerCase()
    : undefined;
  newData.listPrice = product.listPrice
    ? validateNotSmallerThanX(product.listPrice)
    : undefined;
  newData.sellPrice = product.sellPrice
    ? validateNotSmallerThanX(product.sellPrice)
    : undefined;
  newData.stockQuantity = product.stockQuantity
    ? validateNotSmallerThanX(product.stockQuantity)
    : undefined;
  newData.productMediaIds =
    product.productMediaIds && product.productMediaIds.length > 0
      ? product.productMediaIds
      : undefined;
  newData.attributes =
    product.attributes && product.attributes.length > 0
      ? product.attributes.map(attribute => validateProductAttribute(attribute))
      : undefined;

  return newData;
};

const validateUpdateProductInput = data => {
  if (!data || data.length === 0) {
    logger.error("Invalid productId");
    throw new Error("Invalid input");
  }

  const newData = data.map(product => validateUpdateOneProductInput(product));

  return newData;
};

const classifyEmailPhone = emailOrPhone => {
  // email pattern: mailbox @ domain
  // email address is no longer than 63 character
  const emailRegex = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;

  if (emailRegex.test(emailOrPhone)) {
    // make sure domain contains only lowercase characters
    const [name, domain] = stringTrim(emailOrPhone).split("@");
    const refined = `${name}@${domain.toLowerCase()}`;
    return { email: refined };
  }

  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  if (phoneRegex.test(emailOrPhone)) return { phone: emailOrPhone };

  logger.error("Not recognize neither email nor phone");
  throw new Error("Invalid input");
};

export {
  validateNotSmallerThanX,
  validateProductAttribute,
  validateProduct,
  validateCreateNewProductInput,
  validateUpdateOneProductInput,
  validateUpdateProductInput,
  classifyEmailPhone,
};
