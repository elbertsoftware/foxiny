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

// const validateSecurityAnswer = answer => {
//   // Throw error if input is white spaces
//   if (!answer || !answer.trim()) throw new Error('Invalid input');
// };

const validateSecQnA = questionOrAnswer => {
  // Throw error if input is white spaces
  if (!questionOrAnswer || !questionOrAnswer.trim()) throw new Error('Invalid input');
};

const validateName = name => {
  // Throw error if input is empty/null/undefined or white spaces
  if (!name || !name.trim()) throw new Error('Invalid input');
};

/**
 * validate inputs before creating a user
 * @param {nested data} data
 */
const validateCreateInput = data => {
  // To create a user, either email or phone is required
  if ((!data.email && !data.phone) || !data.name || !data.password) throw new Error('Invalid input');
  if (data.email) {
    validateEmail(data.email);
  } else {
    validatePhone(data.phone);
  }
  validateName(data.name);
  validatePwd(data.password);
  validateSecQnA(data.questionA);
  validateSecQnA(data.answerA);
  validateSecQnA(data.questionB);
  validateSecQnA(data.answerB);
};

/**
 * validate inputs before updating a user
 * @param {nested data} data
 */
const validateUpdateInput = data => {
  // if (data.name) validateName(data.name); // no need to check name input since we remove it if null
  if (data.email) validateEmail(data.email);
  if (data.phone) validatePhone(data.phone);
  if (data.password) {
    validatePwd(data.password);
    validatePwd(data.currentPassword);
  }
};

const validateResetPwdInput = data => {
  validateSecQnA(data.answerA);
  validateSecQnA(data.answerB);
  validatePwd(data.password);
};

export {
  removeEmptyProperty,
  validateCreateInput,
  validateUpdateInput,
  validateResetPwdInput,
  validateName,
  validateEmail,
  validatePhone,
  validatePwd,
  validateSecQnA,
  // validateSecurityAnswer,
};
