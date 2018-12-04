// @flow

import { getUserId } from '../utils/authentication';

const User = {
  email: {
    // fragment is needed to be sure User.id included no matter what the clients ask for it in the selection
    fragment: 'fragment userId on User { id }',
    resolve: (parent, args, { request }, info) => {
      // How email is locked down for non-authorization
      const userId = getUserId(request, false); // no need to check for authentication
      if (userId && userId === parent.id) {
        // login user is the same as selecting user (parent)
        return parent.email;
      }

      return null;
    },
  },
};

export default User;
