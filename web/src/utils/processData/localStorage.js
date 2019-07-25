// @flow

const AUTHORIZATION_TOKEN_KEY = 'authorizationToken';
const USERID = 'userID';
const SELLERID = 'sellerId';

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

const setUserInfo = userId => {
  if (localStorage) {
    localStorage.setItem(USERID, userId);
  }
};

const getUserInfo = () => {
  if (localStorage) {
    return localStorage.getItem(USERID);
  }
  return '';
};

const removeUserInfo = () => {
  localStorage.removeItem(USERID);
};

const setSellerId = sellerId => {
  if (localStorage) {
    localStorage.setItem(SELLERID, sellerId);
  }
};

const getSellerId = () => {
  if (localStorage) {
    return localStorage.getItem(SELLERID);
  }
  return '';
};

const removeSellerId = () => {
  localStorage.removeItem(SELLERID);
};

export {
  getAuthorizationToken,
  setAuthorizationToken,
  removeAuthorizationToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  setSellerId,
  getSellerId,
  removeSellerId,
};
