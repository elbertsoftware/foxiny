// @flow

import { getUserIDFromRequest } from '../utils/authentication';
import logger from '../utils/logger';

// How to lock down sensitive fields on non-authenticated users
const resolveField = async (parent, request, cache, value) => {
  const userId = await getUserIDFromRequest(request, cache, false); // no need to check for authentication
  logger.debug(`userId ${userId}, parent.id ${parent.id}`);
  if (userId && userId === parent.id) {
    // login user is the same as selecting user (parent)
    return value;
  }

  return null;
};

const resolveSecurityInfo = async (parent, request, cache, value) => {
  // const userId = await getUserIDFromRequest(request, cache, false); // no need to check for authentication
  // logger.debug(`userId ${userId}, parent.id ${parent.id}`);
  // console.log(JSON.stringify(parent, undefined, 2));
  // if (userId && userId === parent.id) {
  //   // login user is the same as selecting user (parent)
  //   const securityQueAns = parent.securityAnswers.map(answer => ({
  //     questionId: answer.securityQuestion.id,
  //     question: answer.securityQuestion.question,
  //     answerId: answer.id,
  //     answer: answer.answer,
  //   }));

  //   return securityQueAns;
  // }

  const securityQueAns = parent.securityAnswers.map(answer => ({
    questionId: answer.securityQuestion.id,
    question: answer.securityQuestion.question,
    answerId: answer.id,
    answer: answer.answer,
  }));

  return securityQueAns;
  // return null;
};

// fragment is needed to be sure User.id included no matter what the clients ask for it in the selection
const User = {
  email: {
    fragment: 'fragment userIdForEmail on User { id }',

    resolve: (parent, args, { request, cache }) => {
      return resolveField(parent, request, cache, parent.email);
    },
  },

  phone: {
    fragment: 'fragment userIdForPhone on User { id }',
    resolve: (parent, args, { request, cache }) => {
      return resolveField(parent, request, cache, parent.phone);
    },
  },

  password: () => {
    return null; // never show password
  },

  securityAnswers: () => {
    return null; // never show securityAnswers too
  },

  // TODO: hide all security info from client too
  securityInfo: {
    resolve: (parent, args, { request, cache }) => {
      return resolveSecurityInfo(parent, request, cache, parent.phone);
    },
  },
};

export default User;
