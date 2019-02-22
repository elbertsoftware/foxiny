const removeEmptyProperty = obj => {
  Object.keys(obj).forEach(key => !obj[key] && obj[key] !== undefined && delete obj[key]);
  return obj;
};

const validateEmail = email => {
  const emailRegex = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;

  if (!emailRegex.test(email)) throw new Error('Invalid input');
};

const validatePhone = phone => {
  // Phone is only numbers, can be splitted into groups by dash, dot, space or splash
  // Phone can contains plus sign at the beginning
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  if (!phoneRegex.test(phone)) throw new Error('Invalid input');
};

const validatePwd = password => {
  // Pwd must containts uppercase & lowercase letters, & numbers & special characters
  // Pwd must be at lease 8
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!password || !pwdRegex.test(password)) throw new Error('Invalid input');
};

const validateIsEmpty = value => {
  // Throw error if input is empty/null/undefined or white spaces
  if (!value || !value.trim()) throw new Error('Invalid input');
};

/**
 * validate input before creating security questions
 * @param {Object} questionAnswerPairs is array of object, each object has two properties: question or questionId and answer
 */
const validateSecurityInfo = questionAnswerPairs => {
  if (questionAnswerPairs.length < 3) throw new Error('Invalid input');
  questionAnswerPairs.forEach(pair => {
    if (!pair.questionId && !pair.question) throw new Error('Invalid input');
    if (pair.questionId) validateIsEmpty(pair.questionId);
    if (pair.question) validateIsEmpty(pair.question);
    validateIsEmpty(pair.answer);
  });
};

/**
 * validate inputs before creating a user
 * @param {Object} data
 */
const validateCreateInput = data => {
  // To create a user, either email or phone is required
  if (!data.email && !data.phone) throw new Error('Invalid input');
  if (data.email) {
    validateEmail(data.email);
  } else {
    validatePhone(data.phone);
  }
  validateIsEmpty(data.name);
  validatePwd(data.password);
};

/**
 * validate inputs before activating user account
 * @param {Object} data contains userId or email or phone and the code
 */
const validateConfirmInput = data => {
  if (!(!data.userId ^ !data.email ^ !data.phone ^ !(data.userId && data.email && data.phones))) {
    throw new Error('Invalid input');
  }
  if (data.userId) validateIsEmpty(data.userId);
  if (data.code) validateIsEmpty(data.code);
  if (data.email) validateEmail(data.email);
  if (data.phone) validatePhone(data.phone);
};

/**
 * validate inputs before resending new confirmation code
 * only one of three values is accepted
 * @param {Object} data contains userId or email or phone
 */
const validateResendConfirmationInput = data => {
  if (!(!data.userId ^ !data.email ^ !data.phone ^ !(data.userId && data.email && data.phones))) {
    throw new Error('Invalid input');
  }
  if (data.email) validateEmail(data.email);
  if (data.phone) validatePhone(data.phone);
  if (data.userId) validateIsEmpty(data.userId);
};

/**
 * validate inputs before updating a user
 * @param {Object} data
 */
const validateUpdateInput = data => {
  if (data.name) validateIsEmpty(data.name);
  if (data.email) validateEmail(data.email);
  if (data.phone) validatePhone(data.phone);
  if (data.password) {
    validatePwd(data.password);
    validatePwd(data.currentPassword);
  }
};

/**
 *
 * @param {Object} data
 */
const validateResetPwdInput = data => {
  validateSecurityInfo(data.securityInfo);
  validatePwd(data.password);
};

export {
  removeEmptyProperty,
  validateCreateInput,
  validateSecurityInfo,
  validateConfirmInput,
  validateResendConfirmationInput,
  validateUpdateInput,
  validateResetPwdInput,
  validateEmail,
  validatePhone,
  validatePwd,
  validateIsEmpty,
};
