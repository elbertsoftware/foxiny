// @floww

import { stringTrim, validateIsEmpty } from "../validation";
import logger from "../logger";

const validateIsSmallerThanX = (price, x = 0) => {
  if (price <= x) {
    logger.error("Invalid price");
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
  newData.detailDescription = data.detailDescription;
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
  newData.productName = validateIsEmpty(product.productName).toLowerCase();
  newData.listPrice = validateIsSmallerThanX(product.listPrice);
  newData.sellPrice = validateIsSmallerThanX(product.sellPrice);
  newData.stockQuantity = validateIsSmallerThanX(product.stockQuantity);
  newData.productMediaIds = product.productMediaIds;
  newData.attributes = product.attributes.map(attribute => validateProductAttribute(attribute));

  return newData;
};

const validateUpdateProductInput = data => {
  const newData = data.map(product => validateUpdateOneProductInput(product));

  return newData;
};

export { validateCreateNewProductInput, validateUpdateProductInput };

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

  return null;
};

export { classifyEmailPhone };
