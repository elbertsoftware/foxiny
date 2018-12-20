// @flow

const AUTHORIZATION_TOKEN_KEY = 'authorizationToken';

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

export { getAuthorizationToken, setAuthorizationToken };
