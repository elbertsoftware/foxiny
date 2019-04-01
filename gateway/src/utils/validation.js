// @flow

import path from 'path';

const stringTrim = text => text && text.replace(/\s\s+/g, ' ').trim();

const validateIsEmpty = value => {
  const refined = stringTrim(value);
  // Throw error if input is empty/null/undefined or white spaces
  if (!refined) throw new Error('Invalid input');

  return refined;
};

const classifyEmailPhone = emailOrPhone => {
  // email pattern: mailbox @ domain
  // email address is no longer than 63 character
  const emailRegex = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;

  if (emailRegex.test(emailOrPhone)) {
    // make sure domain contains only lowercase characters
    const [name, domain] = stringTrim(emailOrPhone).split('@');
    const refined = `${name}@${domain.toLowerCase()}`;
    return { email: refined };
  }

  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  if (phoneRegex.test(emailOrPhone)) return { phone: emailOrPhone };

  return null;
};

export { stringTrim, classifyEmailPhone, validateIsEmpty };

const validateEmail = email => {
  // email pattern: mailbox @ domain
  // email address is no longer than 63 character
  const emailRegex = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;

  if (!emailRegex.test(email)) throw new Error('Invalid input');

  // make sure domain contains only lowercase characters
  const [name, domain] = stringTrim(email).split('@');
  const refined = `${name}@${domain.toLowerCase()}`;

  return refined;
};

const validatePhone = phone => {
  // Phone is only numbers, can be splitted into groups by dash, dot, space or splash
  // Phone can contains plus sign at the beginning
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  if (!phoneRegex.test(phone)) throw new Error('Invalid input');

  // remove all special character except plus sign
  const refined = stringTrim(phone).replace(/-|_|\s|\.|\//g, '');

  // Phone number digits cannot greater than 15
  if (refined.length > 15) throw new Error('Invalid input');

  return refined;
};

const validatePwd = password => {
  // Pwd must containts uppercase & lowercase letters, & numbers & special characters
  // Pwd must be at lease 8 and not over 63 letters
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!password || !pwdRegex.test(password)) throw new Error('Invalid input');

  return password;
};

const validateName = name => {
  const refined = validateIsEmpty(name);

  if (refined.length > 127) throw new Error('Invalid input');

  return refined;
};

/**
 * validate input before creating security questions
 * @param {Object} questionAnswerPairs is array of object, each object has two properties: question or questionId and answer
 */
const validateSecurityInfo = questionAnswerPairs => {
  if (questionAnswerPairs.length < 3) throw new Error('Invalid input');
  questionAnswerPairs.forEach(pair => {
    if (!pair.questionId && !stringTrim(pair.question)) throw new Error('Invalid input');
    if (pair.questionId) validateIsEmpty(pair.questionId);
    if (pair.question) validateIsEmpty(pair.question);
    validateIsEmpty(pair.answer);
  });

  const refined = questionAnswerPairs.map(pair => {
    const refinedQuestion = stringTrim(pair.question);
    const refinedAnswer = stringTrim(pair.answer);

    const newPair = {};

    if (!pair.questionId && !refinedQuestion) throw new Error('Invalid input');
    if (pair.questionId) newPair.questionId = validateIsEmpty(pair.questionId);
    if (pair.question) newPair.question = validateIsEmpty(refinedQuestion);
    newPair.answer = validateIsEmpty(refinedAnswer).toLowerCase();

    return newPair;
  });

  return refined;
};

/**
 * validate inputs before creating a user
 * @param {Object} data
 */
const validateCreateInput = data => {
  // To create a user, either email or phone is required
  if ((!data.email && !data.phone) || (data.email && data.phone)) throw new Error('Invalid input');

  const refined = {};

  if (data.email) {
    refined.email = validateEmail(data.email);
  } else {
    refined.phone = validatePhone(data.phone);
  }
  refined.name = validateName(data.name);
  refined.password = validatePwd(data.password);

  return refined;
};

/**
 * validate inputs before activating user account
 * @param {Object} data contains userId or email or phone and the code
 */
const validateConfirmInput = data => {
  if (!(!data.userId ^ !data.email ^ !data.phone ^ !(data.userId && data.email && data.phone))) {
    throw new Error('Invalid input');
  }

  const refined = {};

  refined.code = validateIsEmpty(data.code);
  if (data.userId) refined.userId = validateIsEmpty(data.userId);
  if (data.email) refined.email = validateEmail(data.email);
  if (data.phone) refined.phone = validatePhone(data.phone);

  return refined;
};

/**
 * validate inputs before resending new confirmation code
 * only one of three values is accepted
 * @param {Object} data contains userId or email or phone
 */
const validateResendConfirmationInput = data => {
  if (!(!data.userId ^ !data.email ^ !data.phone ^ !(data.userId && data.email && data.phone))) {
    throw new Error('Invalid input');
  }

  const refined = {};

  if (data.email) refined.email = validateEmail(data.email);
  if (data.phone) refined.phone = validatePhone(data.phone);
  if (data.userId) refined.userId = validateIsEmpty(data.userId);

  return refined;
};

/**
 * validate inputs before updating a user
 * @param {Object} data
 */
const validateUpdateInput = data => {
  const refined = {};

  if (data.name) refined.name = validateName(data.name);
  if (data.email) refined.email = validateEmail(data.email);
  if (data.phone) refined.phone = validatePhone(data.phone);
  if (data.password) refined.password = validatePwd(data.password);
  if (data.currentPassword) refined.currentPassword = validatePwd(data.currentPassword);

  return refined;
};

/**
 * validate inputs
 * @param {Object} data
 */
const validateResetPwdInput = data => {
  const refined = {};

  refined.securityInfo = validateSecurityInfo(data.securityInfo);
  refined.password = validatePwd(data.password);

  return refined;
};

export {
  validateCreateInput,
  validateSecurityInfo,
  validateConfirmInput,
  validateResendConfirmationInput,
  validateUpdateInput,
  validateResetPwdInput,
  validateName,
  validateEmail,
  validatePhone,
  validatePwd,
};

const IMAGE_TYPES = ['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'];

/**
 * validate type of file by checking the mime type from header
 * @param {String} mimetype MIME type
 */
const validateImageFileType = mimetype => {
  if (!mimetype) throw new Error('Invalid input');
  if (!IMAGE_TYPES.includes(mimetype)) throw new Error('File type is not allowed');
};

const validateImageUploadInput = upload => {
  if (!upload) throw new Error('Invalid Input');

  const { createReadStream, filename, mimetype, encoding } = upload;

  if (!createReadStream) throw new Error('Invalid input');
  if (!filename || !path.extname(filename)) throw new Error('Invalid input');
  if (!mimetype) throw new Error('Invalid input');
  if (!encoding) throw new Error('Invalid input');

  validateImageFileType(mimetype);
};

export { validateImageFileType, validateImageUploadInput };
