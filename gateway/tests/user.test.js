// @flow

jest.useRealTimers();

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import stream from 'stream';
import jwt from 'jsonwebtoken';

import prisma from '../src/utils/prisma';
import cache from '../src/utils/cache';
import getGraphQLClient, { getGraphQLClientWithTunnel } from './utils/get-graphql-client';

import operations from './utils/operations';
import logger from '../src/utils/logger';
import * as auth from '../src/utils/authentication';
import * as validation from '../src/utils/validation';
import * as email from '../src/utils/email';
import * as sms from '../src/utils/sms';
import * as smsVN from '../src/utils/smsVN';
import * as fsHelper from '../src/utils/fsHelper';
import * as s3 from '../src/utils/s3Uploader';

import seedTestData, { seedUserOne, seedUserTwo, seedUserThree } from './utils/seed-test-data';

const authenticationTestData = require('./data/user/authentication.json');
const emailTestData = require('./data/user/email.json');
const fsHelperTestData = require('./data/user/fsHelper.json');
const mutationTestData = require('./data/user/mutation.json');
const queryTestData = require('./data/user/query.json');
const validationTestData = require('./data/user/validation.json');

/**
 * Declarations
 */

// fake client
const graphQLClient = getGraphQLClient();
// fake ip
const ngrok = require('ngrok');
// fake request
const request = new Request('test', { method: 'POST', headers: { 'X-Forwarded-Proto': '127.0.0.1' } });
request.connection = { remoteAddress: '::1' };
// fake reading stream
const _SAMPLE_IMG_FILE = new stream.Readable();
_SAMPLE_IMG_FILE.push('hello');
_SAMPLE_IMG_FILE.push(null);

// NOTE: to import json/js files, set moduleDirectories and moduleFileExtensions in jest configs in package.json
// NOTE: to get the test coverage: set collectCoverage in jest configs in package.json

/**
 * Unit tests on local
 */

describe('Tests on local-ip', () => {
  describe('Validation functions tests', () => {
    validationTestData.forEach(group => {
      switch (group.name) {
        case 'stringTrim':
          describe('String Trim', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should trim text ${group.data[i].text}`, () => {
                  expect(validation.stringTrim(group.data[i].text).length).toBeLessThan(group.data[i].text.length);
                });
              }
            }
          });
          break;

        case 'classifyEmailPhone':
          describe('Classify input as Email, Phone', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected && group.data[i].email) {
                test(`should return input as an email ${group.data[i].email}`, () => {
                  expect(validation.classifyEmailPhone(group.data[i].emailOrPhone).email).toBe(group.data[i].email);
                });
              }
              if (group.data[i].expected && group.data[i].phone) {
                test(`should return input as an phone ${group.data[i].phone}`, () => {
                  expect(validation.classifyEmailPhone(group.data[i].emailOrPhone).phone).toBe(group.data[i].phone);
                });
              }
            }
          });
          break;

        case 'validateName':
          describe('Classify input as Email, Phone', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should return valid name', () => {
                  expect(validation.validateName(group.data[i].name));
                });
              } else {
                test(`should throw error as invalid name input ${group.data[i].name}`, () => {
                  expect(() => validation.validateName(group.data[i].name)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateEmail':
          describe('Validate email address', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid email ${group.data[i].output}`, () => {
                  expect(validation.validateEmail(group.data[i].email)).toBe(group.data[i].output);
                });
              } else {
                test(`should throw error as invalid email input ${group.data[i].email}`, () => {
                  expect(() => validation.validateEmail(group.data[i].email)).toThrow();
                });
              }
            }
          });
          break;

        case 'validatePhone':
          describe('Validate phone number', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid phone number ${group.data[i].output}`, () => {
                  expect(validation.validatePhone(group.data[i].phone)).toBe(group.data[i].output);
                });
              } else {
                test(`should throw error as invalid phone number input ${group.data[i].phone}`, () => {
                  expect(() => validation.validatePhone(group.data[i].phone)).toThrow();
                });
              }
            }
          });
          break;

        case 'validatePwd':
          describe('Validate password', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid password ${group.data[i].output}`, () => {
                  expect(validation.validatePwd(group.data[i].password)).toBe(group.data[i].password);
                });
              } else {
                test(`should throw error as invalid password input ${group.data[i].password}`, () => {
                  expect(() => validation.validatePwd(group.data[i].password)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateIsEmpty':
          describe('Validate a string is empty or not (after trimmed)', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid trimmed string ${group.data[i].value}`, () => {
                  expect(validation.validateIsEmpty(group.data[i].value)).toBe(group.data[i].output);
                });
              } else {
                test(`should throw error as invalid string input ${group.data[i].value}`, () => {
                  expect(() => validation.validateIsEmpty(group.data[i].value)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateSecurityInfo':
          describe('Validate securityInfo', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(validation.validateSecurityInfo(group.data[i].questionAnswerPairs).length).toBe(3);
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateSecurityInfo(group.data[i].questionAnswerPairs)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateCreateInput':
          describe('Validate createUser input', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(() => validation.validateCreateInput(group.data[i].data)).not.toThrow();
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateCreateInput(group.data[i].data)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateConfirmInput':
          describe('Validate confirmation input', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(() => validation.validateConfirmInput(group.data[i].data)).not.toThrow();
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateConfirmInput(group.data[i].data)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateResendConfirmationInput':
          describe('Validate resendConfirmation input', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(() => validation.validateResendConfirmationInput(group.data[i].data)).not.toThrow();
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateResendConfirmationInput(group.data[i].data)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateUpdateInput':
          describe('Validate updateUser input', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(() => validation.validateUpdateInput(group.data[i].data)).not.toThrow();
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateUpdateInput(group.data[i].data)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateResetPwdInput':
          describe('Validate resetPwd input', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(() => validation.validateResetPwdInput(group.data[i].data)).not.toThrow();
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateResetPwdInput(group.data[i].data)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateImageFileType':
          describe('Validate resetPwd input', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(() => validation.validateImageFileType(group.data[i].mimetype)).not.toThrow();
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateImageFileType(group.data[i].mimetype)).toThrow();
                });
              }
            }
          });
          break;

        case 'validateUploadInput':
          describe('Validate userMediaUpload input', () => {
            for (let i = 0; i < group.data.length; i++) {
              const upload = {
                createReadStream: group.data[i].upload.createReadStream ? _SAMPLE_IMG_FILE : undefined,
                filename: group.data[i].upload.filename ? group.data[i].upload.filename : undefined,
                mimetype: group.data[i].upload.mimetype ? group.data[i].upload.mimetype : undefined,
                encoding: group.data[i].upload.encoding ? group.data[i].upload.encoding : undefined,
              };
              if (group.data[i].expected) {
                test(`should return a valid object`, () => {
                  expect(() => validation.validateUploadInput(upload)).not.toThrow();
                });
              } else {
                test(`should throw error as invalid object input`, () => {
                  expect(() => validation.validateUploadInput(upload)).toThrow();
                });
              }
            }
          });
          break;

        default:
          break;
      }
    });
  });

  describe('Authentication functions tests', () => {
    authenticationTestData.forEach(group => {
      switch (group.name) {
        case 'isValidPassword':
          break;

        case 'hashPassword':
          describe('Hash password', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return a hashed password string`, () => {
                  expect(() => auth.hashPassword(group.data[i].password)).not.toThrow();
                });
              }
            }
          });
          break;

        case 'verifyPassword':
          describe('Verify Password', () => {
            for (let i = 0; i < group.data.length; i++) {
              const hasedPassword_1 = auth.hashPassword('@abc1234');
              const hasedPassword_2 = auth.hashPassword('@abc123');
              if (group.data[i].expected) {
                test(`should return true`, () => {
                  expect(auth.verifyPassword(group.data[i].password, hasedPassword_1)).toBeTruthy();
                });
              } else {
                test(`should return false since wrong pwd`, () => {
                  expect(auth.verifyPassword(group.data[i].password, hasedPassword_2)).toBeFalsy();
                });
              }
            }
          });
          break;

        case 'generateConfirmation':
          describe('Generate Confirmation', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should return confirmation code`, () => {
                  expect(
                    auth.generateConfirmation(cache, group.data[i].userId, group.data[i].emailOrPhone),
                  ).not.toBeNull();
                });
              }
            }
          });
          break;

        case 'verifyConfirmation':
          break;

        case 'generateToken':
          describe('Generate token, save it to cache', () => {
            for (let i = 0; i < group.data.length; i++) {
              test('should return token', async () => {
                const token = auth.generateToken(group.data[i].userId, request, cache);
                expect(token.length).toBeGreaterThanOrEqual(32);
              });
            }
          });

        case 'getTokenFromRequest':
          describe('Get token from request (authed)', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should return token', async () => {
                  const token = auth.generateToken(group.data[i].userId, request, cache);

                  const authedRequest = new Request('test', {
                    method: 'POST',
                    headers: {},
                  });
                  authedRequest.headers.authorization = `Bearer ${token}`;
                  authedRequest.connection = { remoteAddress: '::1' };
                  authedRequest.connection.context = { Authorization: `Bearer ${token}` };

                  expect(auth.getTokenFromRequest(authedRequest)).toBe(token);
                });
              } else {
                test('should return null', async () => {
                  const token = auth.generateToken(group.data[i].userId, request, cache);

                  const authedRequest = new Request('test', {
                    method: 'POST',
                    headers: {},
                  });
                  authedRequest.connection = { remoteAddress: '::1' };

                  expect(auth.getTokenFromRequest(authedRequest)).toBeNull();
                });
              }
            }
          });
          break;

        case 'getUserIdFromRequest':
          describe('Get user Id from request (authed)', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should return userId', async () => {
                  const token = auth.generateToken(group.data[i].userId, request, cache);

                  const authedRequest = new Request('test', {
                    method: 'POST',
                    headers: {},
                  });
                  authedRequest.headers.authorization = `Bearer ${token}`;
                  authedRequest.connection = { remoteAddress: '::1' };
                  authedRequest.connection.context = { Authorization: `Bearer ${token}` };

                  if (!group.data[i].requireAuthentication) {
                    authedRequest.connection = { remoteAddress: '::2' };
                  }

                  if (group.data[i].requireAuthentication) {
                    const userId = await auth.getUserIDFromRequest(authedRequest, cache);
                    expect(userId).toBe(group.data[i].validUserId);
                  } else {
                    const userId = await auth.getUserIDFromRequest(
                      authedRequest,
                      cache,
                      group.data[i].requireAuthentication,
                    );
                    expect(userId).toBeNull();
                  }
                });
              } else {
                test('should throw error or return null', async () => {
                  const token = auth.generateToken(group.data[i].userId, request, cache);

                  const authedRequest = new Request('test', {
                    method: 'POST',
                    headers: {},
                  });
                  authedRequest.headers.authorization = `Bearer ${token}`;
                  authedRequest.connection = { remoteAddress: '::1' };
                  authedRequest.connection.context = {
                    Authorization: `Bearer ${token}`,
                  };

                  if (!group.data[i].request) {
                    authedRequest.headers.authorization = undefined;
                    authedRequest.connection = { remoteAddress: '' };
                    authedRequest.connection.context = {
                      Authorization: undefined,
                    };
                  }

                  if (group.data[i].requireAuthentication) {
                    await expect(
                      auth.getUserIDFromRequest(request, cache, group.data[i].requireAuthentication),
                    ).rejects.toThrow();
                  } else {
                    const userId = await auth.getUserIDFromRequest(
                      authedRequest,
                      cache,
                      group.data[i].requireAuthentication,
                    );
                    expect(userId).toBeNull();
                  }
                });
              }
            }
          });
          break;

        case 'checkTokenExpiration':
          describe('Check jwt expiration', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should verify token', () => {
                  const expiresIn = group.data[i].expiration;
                  const token = jwt.sign({ iat: Date.now() }, 'abc123', { expiresIn });
                  expect(() => jwt.verify(token, 'abc123', { expiresIn })).not.toThrow();
                });
              } else {
                test('should not verify token', async () => {
                  const expiresIn = group.data[i].expiration;
                  const token = jwt.sign({ iat: Date.now() }, 'abc123', { expiresIn });
                  await new Promise(resolve =>
                    setTimeout(() => {
                      expect(() =>
                        jwt.verify(token, 'abc123', { expiresIn: expiresIn, clockTimestamp: Date.now() }),
                      ).toThrow();
                      resolve();
                    }, 3000),
                  );
                }, 5000);
              }
            }
          });
          break;

        default:
          break;
      }
    });
  });

  describe('Email/SMS tests', () => {
    emailTestData.forEach(group => {
      switch (group.name) {
        case 'sendConfirmationEmail':
          describe('Send confirmation email', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should send confirmation email', () => {
                  expect(() =>
                    email.sendConfirmationEmail(group.data[i].name, group.data[i].to, group.data[i].code),
                  ).not.toThrow();
                });
              }
            }
          });
          break;

        case 'sendSMS':
          describe('Send confirmation text (TWILIO)', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should send confirmation text', () => {
                  expect(() =>
                    sms.sendConfirmationText(group.data[i].name, group.data[i].to, group.data[i].code),
                  ).not.toThrow();
                });
              }
            }
          });
          break;

        case 'sendSMSVN':
          describe('Send confirmation text (VHAT ESMS)', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should send confirmation text', () => {
                  expect(() =>
                    smsVN.sendConfirmationEsms(group.data[i].name, group.data[i].to, group.data[i].code),
                  ).not.toThrow();
                });
              }
            }
          });
          break;

        default:
          break;
      }
    });
  });

  describe('Reading File', () => {
    fsHelperTestData.forEach(group => {
      switch (group.name) {
        case 'getFileInfo':
          describe('Get file information', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should get image file information', async () => {
                  const data = await fsHelper.getFileInfo('hello.jpg', 'abc123', _SAMPLE_IMG_FILE);
                  expect(data).not.toBeNull();
                  expect(data.ext).toBe('jpg');
                });
              }
            }
          });
          break;

        default:
          break;
      }
    });
  });

  describe(`Mutation tests`, () => {
    // seeds database
    beforeEach(seedTestData);

    mutationTestData.forEach(group => {
      switch (group.name) {
        case 'createUser':
          describe('Create user', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should create user', async () => {
                  const variables = {
                    data: {
                      name: group.data[i].user.name ? group.data[i].user.name : undefined,
                      email: group.data[i].user.email ? group.data[i].user.email : undefined,
                      phone: group.data[i].user.phone ? group.data[i].user.phone : undefined,
                      password: group.data[i].user.password ? group.data[i].user.password : undefined,
                    },
                  };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.createUser,
                    variables,
                  });

                  const exists = await prisma.exists.User({ id: data.createUser.id });

                  expect(exists).toBe(true);
                });
              } else {
                test('should not create user', async () => {
                  const variables = {
                    data: {
                      name: group.data[i].user.name ? group.data[i].user.name : undefined,
                      email: group.data[i].user.email ? group.data[i].user.email : undefined,
                      phone: group.data[i].user.phone ? group.data[i].user.phone : undefined,
                      password: group.data[i].user.password ? group.data[i].user.password : undefined,
                    },
                  };

                  await expect(graphQLClient.mutate({ mutation: operations.createUser, variables })).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'confirmUser':
          describe('Confirm user', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should confirm user', async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId ? seedUserTwo.user.id : undefined,
                      email: group.data[i].data.email ? seedUserTwo.user.email : undefined,
                      phone: group.data[i].data.phone ? seedUserTwo.user.phone : undefined,
                      code: group.data[i].data.email ? seedUserTwo.confirmEmailCode : seedUserTwo.confirmPhoneCode,
                    },
                  };

                  const { data } = await graphQLClient.mutate({ mutation: operations.confirmUser, variables });

                  expect(data.confirmUser).toBe(true);
                });
              } else {
                test('should not confirm user', async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId ? seedUserTwo.user.id : undefined,
                      email: group.data[i].data.email ? seedUserTwo.user.email : undefined,
                      phone: group.data[i].data.phone ? seedUserTwo.user.phone : undefined,
                      code: group.data[i].data.code
                        ? group.data[i].data.email
                          ? seedUserTwo.confirmEmailCode
                          : seedUserTwo.confirmPhoneCode
                        : undefined,
                    },
                  };

                  await expect(graphQLClient.mutate({ mutation: operations.confirmUser, variables })).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'resendConfirmation':
          describe('Resend confirmation code', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should resend confirmation code', async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId ? seedUserTwo.user.id : undefined,
                      email: group.data[i].data.email ? seedUserTwo.user.email : undefined,
                      phone: group.data[i].data.phone ? seedUserTwo.user.phone : undefined,
                    },
                  };

                  const { data } = await graphQLClient.mutate({ mutation: operations.resendConfirmation, variables });

                  expect(data.resendConfirmation).toBe(true);
                });
              } else {
                test('should not resend confirmation code', async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId ? seedUserTwo.user.id : undefined,
                      email: group.data[i].data.email ? seedUserTwo.user.email : undefined,
                      phone: group.data[i].data.phone ? seedUserTwo.user.phone : undefined,
                    },
                  };

                  await expect(
                    graphQLClient.mutate({ mutation: operations.resendConfirmation, variables }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'login':
          describe('Login', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should log in', async () => {
                  const variables = {
                    data: {
                      email: group.data[i].data.email ? seedUserOne.user.email : undefined,
                      phone: group.data[i].data.phone ? seedUserOne.user.phone : undefined,
                      password: group.data[i].data.password ? seedUserOne.password : undefined,
                    },
                  };

                  const { data } = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  expect(data.login.token.length).toBeGreaterThan(32);
                });
              } else {
                test('should not log in', async () => {
                  const seededUser = group.data[i].data.confirmed ? seedUserOne : seedUserTwo;
                  const variables = {
                    data: {
                      email: group.data[i].data.email ? seededUser.user.email : undefined,
                      phone: group.data[i].data.phone ? seededUser.user.phone : undefined,
                      password: group.data[i].data.password ? seededUser.password : undefined,
                    },
                  };

                  await expect(
                    graphQLClient.mutate({
                      mutation: operations.login,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'logout':
          describe('Log out', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should log out', async () => {
                  // logs in first
                  const variables = {
                    data: {
                      email: seedUserOne.data.email,
                      password: seedUserOne.password,
                    },
                  };
                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
                  const { data } = await graphQLClientWithToken.mutate({ mutation: operations.logout });
                  expect(data.logout.token).toBe(res.data.login.token);
                });
              }
            }
          });
          break;

        case 'upsertSecurityInfo':
          describe('Update/Insert security info', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should update security info', async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
                      password: seedUserOne.password,
                    },
                  };
                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);

                  variables = { securityInfo: group.data[i].securityInfo };

                  const { data } = await graphQLClientWithToken.mutate({
                    mutation: operations.upsertSecurityInfo,
                    variables,
                  });
                  // expect(data.upsertSecurityInfo).toBeNull();
                  expect(data.upsertSecurityInfo.recoverable).toBe(true);
                });
              } else {
                test('should update security info', async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
                      password: seedUserOne.password,
                    },
                  };
                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);

                  variables = { securityInfo: group.data[i].securityInfo };

                  await expect(
                    graphQLClientWithToken.mutate({
                      mutation: operations.upsertSecurityInfo,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'updateUser':
          describe('Update user', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should update user', async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
                      password: seedUserOne.password,
                    },
                  };
                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);

                  variables = {
                    data: {
                      name: group.data[i].data.name || undefined,
                      email: group.data[i].data.email || undefined,
                      phone: group.data[i].data.phone || undefined,
                      password: group.data[i].data.password || undefined,
                      currentPassword: group.data[i].data.currentPassword || undefined,
                    },
                  };
                  const { data } = await graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables });

                  expect(data.updateUser.id).toBeTruthy();
                });
              } else {
                test('should not udpdate user', async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
                      password: seedUserOne.password,
                    },
                  };
                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);

                  variables = {
                    data: {
                      name: group.data[i].data.name || undefined,
                      email: group.data[i].data.email || undefined,
                      phone: group.data[i].data.phone || undefined,
                      password: group.data[i].data.password || undefined,
                      currentPassword: group.data[i].data.currentPassword || undefined,
                    },
                  };

                  await expect(
                    graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'requestResetPwd':
          describe('User forgot pwd and requests resetPWD', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should return security questions', async () => {
                  const variables = { mailOrPhone: group.data[i].mailOrPhone };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.requestResetPwd,
                    variables,
                  });
                  expect(data.requestResetPwd).not.toBeNull();
                  expect(data.requestResetPwd.token).not.toBeNull();
                  expect(data.requestResetPwd.securityQuestions.length).toBeGreaterThanOrEqual(3);
                });
              } else {
                test('should not return security questions', async () => {
                  const variables = { mailOrPhone: group.data[i].mailOrPhone };
                  await expect(
                    graphQLClient.mutate({
                      mutation: operations.requestResetPwd,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'resetPassword':
          describe('User enter security info and new password', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should change pwd', async () => {
                  let variables = { mailOrPhone: seedUserThree.data.email };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.requestResetPwd,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(data.requestResetPwd.token);
                  variables = {
                    data: {
                      securityInfo: data.requestResetPwd.securityQuestions.map((q, i) => ({
                        questionId: q.id,
                        answer: i.toString(),
                      })),
                      password: group.data[i].data.password,
                    },
                  };

                  const res = await graphQLClientWithToken.mutate({ mutation: operations.resetPassword, variables });
                  expect(res.data.resetPassword).toBe(true);
                });
              } else {
                test('should throw error', async () => {
                  let variables = { mailOrPhone: seedUserThree.data.email };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.requestResetPwd,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(
                    group.data[i].token ? data.requestResetPwd.token : null,
                  );
                  variables = {
                    data: {
                      securityInfo: group.data[i].data.securityInfo
                        ? data.requestResetPwd.securityQuestions.map((q, i) => ({
                            questionId: q.id,
                            answer: i.toString(),
                          }))
                        : undefined,
                      password: group.data[i].data.password ? group.data[i].data.password : undefined,
                    },
                  };

                  await expect(
                    graphQLClientWithToken.mutate({ mutation: operations.resetPassword, variables }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        default:
          break;
      }
    });
  });

  describe('Query', () => {
    // seeds database
    beforeEach(seedTestData);

    queryTestData.forEach(group => {
      switch (group.name) {
        case 'users':
          describe('Fetch all users profiles', () => {
            for (let i = 0; i < group.data.length; i++) {
              if (!group.data[i].loggedIn) {
                test('should expose public users profile, return no email or phone', async () => {
                  const { data } = await graphQLClient.query({ query: operations.getUsers });
                  expect(data.users.length).toBeGreaterThanOrEqual(3); // fetch all users
                  expect(data.users[0].name).toBeTruthy(); // show name of first user
                  expect(data.users[0].email).toBeNull(); // show nothing
                  expect(data.users[0].phone).toBeNull(); // snow nothing
                });
              }

              if (group.data[i].loggedIn) {
                test('should expose public users profile, return email or phone of logged-in user', async () => {
                  const variables = {
                    data: {
                      email: seedUserOne.user.email,
                      password: seedUserOne.password,
                    },
                  };

                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
                  const { data } = await graphQLClientWithToken.query({ query: operations.getUsers });
                  expect(data.users.length).toBeGreaterThanOrEqual(3); // fetch all users
                  const loggedInUser = data.users.find(user => user.email === seedUserOne.user.email);
                  expect(loggedInUser.userId).toBe(seedUserOne.user.userId); // show name of first user
                  expect(loggedInUser.email).toBe(seedUserOne.user.email); // shown
                });
              }
            }
          });
          break;

        case 'me':
          describe(`Fetch user profile`, () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should fetch logged-in user's profile`, async () => {
                  const variables = {
                    data: {
                      email: seedUserOne.user.email,
                      password: seedUserOne.password,
                    },
                  };

                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
                  const { data } = await graphQLClientWithToken.query({ query: operations.getProfile });

                  expect(data).not.toBeNull();
                  expect(data.me.email).toBe(seedUserOne.user.email);
                });
              } else {
                test('should not fetch user profile', async () => {
                  await expect(graphQLClient.query({ query: operations.getProfile })).rejects.toThrow();
                });
              }
            }
          });
          break;

        case 'securityQuestions':
          describe(`Fetch security questions`, () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test('should fetch security questions', async () => {
                  const { data } = await graphQLClient.query({ query: operations.getSecurityQuestions });
                  expect(data).not.toBeNull();
                  expect(data.securityQuestions.length).toBeGreaterThanOrEqual(3);
                });
              }
            }
          });
          break;

        default:
          break;
      }
    });
  });
});

/**
 * Unit tests through tunnel
 */

describe('Tests through a tunnel', () => {
  let url; // ngrok tunnel url (connected)
  let xClient; // apollo boost client with ngrok url
  // Open a tunnel before runing all tests
  // and make sure that ngrok return the url that we're going to pass into the apollo booost

  beforeAll(async () => {
    url = await ngrok.connect({
      proto: 'http',
      addr: '127.0.0.1:5000', //local with testing port
    });
    console.log('TEST ngrok tunnel is up');
    console.log('TEST tunnel-URL is: ' + url);
    xClient = getGraphQLClientWithTunnel(null, url);
  }, 10000);

  // Close tunnel after running all tests (this is important)
  afterAll(async () => {
    await ngrok.disconnect(); // stops all tunnels
    await ngrok.kill(); // and kill its process
    console.log('TEST ngrok tunnel is down');
  });

  beforeEach(seedTestData);

  test(`Should one userId has two tokens with different ip in cache`, async () => {
    // log in by email on local ip
    let variables = {
      data: {
        email: 'john@example.com',
        password: '!abcd1234',
      },
    };
    const res1 = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res1.data.login.token.length).toBeGreaterThan(32);

    // log in by phone through ngrok tunnel
    variables = {
      data: {
        phone: '+840386824579',
        password: '!abcd1234',
      },
    };
    const res2 = await xClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res2.data.login.token.length).toBeGreaterThan(32);

    // get all hashes in cache
    const cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(Object.keys(cacheData).length).toBeGreaterThanOrEqual(2);
  });

  test(`Should clean all tokens of an userId in cache`, async () => {
    // local ip
    let variables = {
      data: {
        email: seedUserOne.user.email,
        password: seedUserOne.password,
      },
    };
    const res1 = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res1.data.login.token.length).toBeGreaterThan(32);

    // with ngrok tunnel
    variables = {
      data: {
        phone: seedUserOne.user.phone,
        password: seedUserOne.password,
      },
    };
    const res2 = await xClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res2.data.login.token.length).toBeGreaterThan(32);

    // delete all tokens before they are expired
    auth.deleteAllTokensInCache(cache, seedUserOne.user.id);

    const cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(cacheData).toBeNull();
  });

  test('Should logout all', async () => {
    // log in by email on local ip
    let variables = {
      data: {
        email: seedUserOne.user.email,
        password: seedUserOne.password,
      },
    };
    const res1 = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res1.data.login.token.length).toBeGreaterThan(32);

    // log in by phone through ngrok tunnel
    variables = {
      data: {
        phone: seedUserOne.user.phone,
        password: seedUserOne.password,
      },
    };
    const res2 = await xClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res2.data.login.token.length).toBeGreaterThan(32);

    // get all hashes in cache
    let cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(Object.keys(cacheData).length).toBeGreaterThanOrEqual(2);

    // logout all
    const graphQLClientWithToken = getGraphQLClient(res1.data.login.token);
    variables = { all: true };
    const { data } = await graphQLClientWithToken.mutate({ mutation: operations.logout, variables });

    cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(cacheData).toBeNull();
  });
});

describe('Test aws s3', () => {
  beforeEach(seedTestData);

  test('should upload', async () => {
    const upload = {
      createReadStream: _SAMPLE_IMG_FILE,
      filename: 'test.jpg',
      mimetype: 'image/jpg',
      encoding: '7 bit',
    };
    expect(seedUserOne.user.id).not.toBeNull();
    await expect(() => s3.s3ProfileMediaUploader(prisma, upload, seedUserOne.user.id)).not.toThrow();
  });
});
