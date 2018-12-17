// @flow

import { getUserId } from '../utils/authentication';

// How to lock down sensitive fields on non-authenticated users
const resolveField = (parent, request, value) => {
  const userId = getUserId(request, false); // no need to check for authentication
  if (userId && userId === parent.id) {
    // login user is the same as selecting user (parent)
    return value;
  }

  return null;
};

// fragment is needed to be sure User.id included no matter what the clients ask for it in the selection
const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve: (parent, args, { request }) => {
      return resolveField(parent, request, parent.email);
    },
  },
  phone: {
    fragment: 'fragment userId on User { id }',
    resolve: (parent, args, { request }) => {
      return resolveField(parent, request, parent.phone);
    },
  },
};

export default User;
