// @flow

import "cross-fetch/polyfill";

import stream from "stream";
import * as validation from "../../../src/utils/retailerUtils/validation";

// import test data
const validationTestData = require("./testData/retailerUtils.validation.json");

describe("Validation functions tests", () => {
  validationTestData.forEach(group => {
    switch (group.name) {
      case "validateCreateRetailerInput":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should validate address input", async () => {
              const data = validation.validateCreateRetailerInput(
                group.data[i].data,
              );
              expect(data).not.toBeUndefined();
              expect(data.businessName).not.toBeUndefined();
              expect(data.businessEmail).not.toBeUndefined();
              expect(data.businessPhone).not.toBeUndefined();
            });
          } else {
            test("should invalidate address input", async () => {
              expect(() =>
                validation.validateCreateRetailerInput(group.data[i].data),
              ).toThrow();
            });
          }
        }
        break;

      case "validateUpdateRetailerInput":
        for (let i = 0; i < group.data.length; i++) {
          if (group.data[i].expected === true) {
            test("should validate update retailer input", async () => {
              const data = validation.validateUpdateRetailerInput(
                group.data[i].data,
              );
              expect(data).not.toBeUndefined();
              expect(data.businessName).not.toBeUndefined();
              expect(data.businessEmail).not.toBeUndefined();
              expect(data.businessPhone).not.toBeUndefined();
            });
          } else {
            test("should invalidate update retailer input", async () => {
              expect(() =>
                validation.validateUpdateRetailerInput(group.data[i].data),
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
