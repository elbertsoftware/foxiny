const validateCreateUserInput = (name, email, phone, password, questionA, answerA, questionB, answerB) => {
  if ((!email && !phone) || !name || !password || !questionA || !answerA || !questionB || !answerB) {
    throw new Error('Bad request, null value');
  }

  const emailReg = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;

  if (email && !emailReg.test(email)) {
    throw new Error('Invalid input');
  }

  const phoneReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  if (phone && !phoneReg.test(phone)) {
    throw new Error('Invalid input');
  }

  const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (password && !pwdReg.test(password)) {
    throw new Error('Invalid input');
  }
};

const validateUpdateUserInput = (name, email, phone, password, currentPwd) => {
  const emailReg = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;

  if (email && !emailReg.test(email)) {
    throw new Error('Invalid input');
  }

  const phoneReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  if (phone && !phoneReg.test(phone)) {
    throw new Error('Invalid input');
  }

  const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (password && !pwdReg.test(password)) {
    throw new Error('Invalid input');
  }

  if (currentPwd && (currentPwd.length < 8 || !pwdReg.test(currentPwd))) {
    throw new Error('Invalid input');
  }
};

const removeEmptyProperty = obj => {
  Object.keys(obj).forEach(key => !obj[key] && obj[key] !== undefined && delete obj[key]);
  return obj;
};

export { validateCreateUserInput, validateUpdateUserInput, removeEmptyProperty };
