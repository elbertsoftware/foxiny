// @flow

const AUTHORIZATION_TOKEN_KEY = 'authorizationToken';
const USERNAME = 'userName';
const USERID = 'userID';

// retrieve authencation token from browser localStorage/session
const getAuthorizationToken = () => {
  if (localStorage) {
    return localStorage.getItem(AUTHORIZATION_TOKEN_KEY);
  }

  return '';
};

// store authentication token after logging in to browser localStorage/session
const setAuthorizationToken = token => {
  if (localStorage) {
    localStorage.setItem(AUTHORIZATION_TOKEN_KEY, token);
  }
};

const removeAuthorizationToken = () => {
  localStorage.removeItem(AUTHORIZATION_TOKEN_KEY);
};

const setUserInfo = (userId, userName) => {
  if (localStorage) {
    localStorage.setItem(USERNAME, userName);
    localStorage.setItem(USERID, userId);
  }
};

const getUserInfo = () => {
  if (localStorage) {
    return {
      id: localStorage.getItem(USERID),
      name: localStorage.getItem(USERNAME),
    };
  }
  return '';
};

const removeUserInfo = () => {
  localStorage.removeItem(USERID);
  localStorage.removeItem(USERNAME);
};

export {
  getAuthorizationToken,
  setAuthorizationToken,
  removeAuthorizationToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
};
