const validateInputCreateUser = (name, email, phone, password, questionA, answerA, questionB, answerB) => {
  if ((!email && !phone) || !name || !password || !questionA || !answerA || !questionB || !answerB) {
    throw new Error('Bad request, null value');
  }

  const emailReg = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;

  if (email && !emailReg.test(email)) {
    throw new Error('Unvalid email');
  }

  const phoneReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  if (phone && !phoneReg.test(phone)) {
    throw new Error('Unvalid phone number');
  }

  const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (password && (password.length < 6 || !pwdReg.test(password))) {
    throw new Error('Unvalid password');
  }
};

const removeEmptyProperty = obj => {
  Object.keys(obj).forEach(key => !obj[key] && obj[key] !== undefined && delete obj[key]);
  return obj;
};

export { validateInputCreateUser, removeEmptyProperty };
