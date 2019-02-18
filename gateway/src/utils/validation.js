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

const validateSecurityInfo = questionAnswerPairs => {
  if (questionAnswerPairs.length < 3) throw new Error('Invalid input');
  questionAnswerPairs.forEach(pair => {
    validateIsEmpty(pair.questionId);
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
  validateSecurityInfo(data.securityInfo);
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
  validateUpdateInput,
  validateResetPwdInput,
  validateEmail,
  validatePhone,
  validatePwd,
  validateIsEmpty,
};
