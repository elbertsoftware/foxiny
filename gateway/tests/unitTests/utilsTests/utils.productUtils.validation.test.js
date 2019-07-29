// @flow

import "cross-fetch/polyfill";

import stream from "stream";
import * as validation from "../../../src/utils/productUtils/validation";

// import test data
const validationTestData = require("./testData/productUtils.validation.json");

describe("Validation functions tests", () => {
  validationTestData.forEach(group => {
    switch (group.name) {
      case "validateNotSmallerThanX":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should prove a value is smaller than a given number", async () => {
              let { value, x } = group.data[i].data;
              if (value === "NEGATIVE") value = -Number.MAX_SAFE_INTEGER;
              if (value === "POSITIVE") value = Number.MAX_SAFE_INTEGER;
              if (value === "NEGATIVE-1") value = -Number.MAX_SAFE_INTEGER - 1;
              if (value === "POSITIVE+1") value = Number.MAX_SAFE_INTEGER + 1;

              const data = validation.validateNotSmallerThanX(value, x);
              expect(Number.isSafeInteger(data)).toBeTruthy();
            });
          } else {
            test("should not prove a value is smaller than a given number", async () => {
              let { value, x } = group.data[i].data;
              if (value === "NEGATIVE") value = -Number.MAX_SAFE_INTEGER;
              if (value === "POSITIVE") value = Number.MAX_SAFE_INTEGER;
              if (value === "NEGATIVE-1") value = -Number.MAX_SAFE_INTEGER - 1;
              if (value === "POSITIVE+1") value = Number.MAX_SAFE_INTEGER + 1;

              expect(() =>
                validation.validateNotSmallerThanX(value, x),
              ).toThrow();
            });
          }
        }
        break;

      case "validateProductAttribute":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should validate attribute input", async () => {
              const data = validation.validateProductAttribute(
                group.data[i].data,
              );
              expect(data).not.toBeUndefined();
              expect(data.attributeName).toBe(group.data[i].expectedAttName);
              expect(data.value).toBe(group.data[i].expectedValue);
            });
          } else {
            test("should not validate attribute input", async () => {
              expect(() =>
                validation.validateProductAttribute(group.data[i].data),
              ).toThrow();
            });
          }
        }
        break;

      case "validateProduct":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should validate product input", async () => {
              const data = validation.validateProduct(group.data[i].data);
              expect(data).not.toBeUndefined();
            });
          } else {
            test("should not validate product input", async () => {
              expect(() =>
                validation.validateProduct(group.data[i].data),
              ).toThrow();
            });
          }
        }
        break;

      case "validateCreateNewProductInput":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should validate create product input", async () => {
              const data = validation.validateCreateNewProductInput(
                group.data[i].data,
              );
              expect(data).not.toBeUndefined();
            });
          } else {
            test("should not validate create product input", async () => {
              expect(() =>
                validation.validateCreateNewProductInput(group.data[i].data),
              ).toThrow();
            });
          }
        }
        break;

      case "validateUpdateOneProductInput":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should validate update one product input", async () => {
              const data = validation.validateUpdateOneProductInput(
                group.data[i].data,
              );
              expect(data).not.toBeUndefined();
            });
          } else {
            test("should not validate update one product input", async () => {
              expect(() =>
                validation.validateUpdateOneProductInput(group.data[i].data),
              ).toThrow();
            });
          }
        }
        break;

      case "validateUpdateProductInput":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should validate update products input", async () => {
              const data = validation.validateUpdateProductInput(
                group.data[i].data,
              );
              expect(data).not.toBeUndefined();
            });
          } else {
            test("should not validate update products input", async () => {
              expect(() =>
                validation.validateUpdateProductInput(group.data[i].data),
              ).toThrow();
            });
          }
        }
        break;

      case "classifyEmailPhone":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should classify email/phone", async () => {
              const data = validation.classifyEmailPhone(group.data[i].data);
              expect(data).not.toBeUndefined();
              if (group.data[i].returned === "email") {
                expect(data.email).toBe(group.data[i].expectedData);
              } else if (group.data[i].returned === "phone") {
                expect(data.phone).toBe(group.data[i].expectedData);
              }
            });
          } else {
            test("should not classify email/phone", async () => {
              expect(() =>
                validation.classifyEmailPhone(group.data[i].data),
              ).toThrow();
            });
          }
        }
        break;

      default:
        break;
    }
  });
});
