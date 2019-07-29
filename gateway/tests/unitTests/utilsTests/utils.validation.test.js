// @flow

import "cross-fetch/polyfill";

import stream from "stream";
import * as validation from "../../../src/utils/validation";

// import test data
const validationTestData = require("./testData/validation.json");

// fake reading stream
const _SAMPLE_IMG_FILE = new stream.Readable();
_SAMPLE_IMG_FILE.push("hello");
_SAMPLE_IMG_FILE.push(null);

describe("Validation functions tests", () => {
  validationTestData.forEach(group => {
    switch (group.name) {
      case "stringTrim":
        describe("String Trim", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should trim text ${group.data[i].text}`, () => {
                expect(
                  validation.stringTrim(group.data[i].text).length,
                ).toBeLessThan(group.data[i].text.length);
              });
            }
          }
        });
        break;

      case "classifyEmailPhone":
        describe("Classify input as Email, Phone", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected && group.data[i].email) {
              test(`should return input as an email ${
                group.data[i].email
              }`, () => {
                expect(
                  validation.classifyEmailPhone(group.data[i].emailOrPhone)
                    .email,
                ).toBe(group.data[i].email);
              });
            }
            if (group.data[i].expected && group.data[i].phone) {
              test(`should return input as an phone ${
                group.data[i].phone
              }`, () => {
                expect(
                  validation.classifyEmailPhone(group.data[i].emailOrPhone)
                    .phone,
                ).toBe(group.data[i].phone);
              });
            }
          }
        });
        break;

      case "validateName":
        describe("Classify input as Email, Phone", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should return valid name", () => {
                expect(validation.validateName(group.data[i].name));
              });
            } else {
              test(`should throw error as invalid name input ${
                group.data[i].name
              }`, () => {
                expect(() =>
                  validation.validateName(group.data[i].name),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateEmail":
        describe("Validate email address", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid email ${
                group.data[i].output
              }`, () => {
                expect(validation.validateEmail(group.data[i].email)).toBe(
                  group.data[i].output,
                );
              });
            } else {
              test(`should throw error as invalid email input ${
                group.data[i].email
              }`, () => {
                expect(() =>
                  validation.validateEmail(group.data[i].email),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validatePhone":
        describe("Validate phone number", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid phone number ${
                group.data[i].output
              }`, () => {
                expect(validation.validatePhone(group.data[i].phone)).toBe(
                  group.data[i].output,
                );
              });
            } else {
              test(`should throw error as invalid phone number input ${
                group.data[i].phone
              }`, () => {
                expect(() =>
                  validation.validatePhone(group.data[i].phone),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validatePwd":
        describe("Validate password", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid password ${
                group.data[i].output
              }`, () => {
                expect(validation.validatePwd(group.data[i].password)).toBe(
                  group.data[i].password,
                );
              });
            } else {
              test(`should throw error as invalid password input ${
                group.data[i].password
              }`, () => {
                expect(() =>
                  validation.validatePwd(group.data[i].password),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateIsEmpty":
        describe("Validate a string is empty or not (after trimmed)", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid trimmed string ${
                group.data[i].value
              }`, () => {
                expect(validation.validateIsEmpty(group.data[i].value)).toBe(
                  group.data[i].output,
                );
              });
            } else {
              test(`should throw error as invalid string input ${
                group.data[i].value
              }`, () => {
                expect(() =>
                  validation.validateIsEmpty(group.data[i].value),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateSecurityInfo":
        describe("Validate securityInfo", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(
                  validation.validateSecurityInfo(
                    group.data[i].questionAnswerPairs,
                  ).length,
                ).toBe(3);
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateSecurityInfo(
                    group.data[i].questionAnswerPairs,
                  ),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateCreateInput":
        describe("Validate createUser input", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateCreateInput(group.data[i].data),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateCreateInput(group.data[i].data),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateConfirmInput":
        describe("Validate confirmation input", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateConfirmInput(group.data[i].data),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateConfirmInput(group.data[i].data),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateResendConfirmationInput":
        describe("Validate resendConfirmation input", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateResendConfirmationInput(
                    group.data[i].data,
                  ),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateResendConfirmationInput(
                    group.data[i].data,
                  ),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateUpdateInput":
        describe("Validate updateUser input", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateUpdateInput(group.data[i].data),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateUpdateInput(group.data[i].data),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateResetPwdInput":
        describe("Validate resetPwd input", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateResetPwdInput(group.data[i].data),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateResetPwdInput(group.data[i].data),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateImageFileType":
        describe("Validate resetPwd input", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateImageFileType(group.data[i].mimetype),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateImageFileType(group.data[i].mimetype),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateUploadImageInput":
        describe("Validate userMediaUpload input", () => {
          for (let i = 0; i < group.data.length; i++) {
            const upload = {
              createReadStream: group.data[i].upload.createReadStream
                ? _SAMPLE_IMG_FILE
                : undefined,
              filename: group.data[i].upload.filename
                ? group.data[i].upload.filename
                : undefined,
              mimetype: group.data[i].upload.mimetype
                ? group.data[i].upload.mimetype
                : undefined,
              encoding: group.data[i].upload.encoding
                ? group.data[i].upload.encoding
                : undefined,
            };
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateUploadImageInput(upload),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateUploadImageInput(upload),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateDocumentFileType":
        describe("Validate resetPwd input", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateDocumentFileType(group.data[i].mimetype),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateDocumentFileType(group.data[i].mimetype),
                ).toThrow();
              });
            }
          }
        });
        break;

      case "validateUploadDocumnetInput":
        describe("Validate mediaUpload input", () => {
          for (let i = 0; i < group.data.length; i++) {
            const upload = {
              createReadStream: group.data[i].upload.createReadStream
                ? _SAMPLE_IMG_FILE
                : undefined,
              filename: group.data[i].upload.filename
                ? group.data[i].upload.filename
                : undefined,
              mimetype: group.data[i].upload.mimetype
                ? group.data[i].upload.mimetype
                : undefined,
              encoding: group.data[i].upload.encoding
                ? group.data[i].upload.encoding
                : undefined,
            };
            if (group.data[i].expected) {
              test(`should return a valid object`, () => {
                expect(() =>
                  validation.validateUploadDocumnetInput(upload),
                ).not.toThrow();
              });
            } else {
              test(`should throw error as invalid object input`, () => {
                expect(() =>
                  validation.validateUploadDocumnetInput(upload),
                ).toThrow();
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
