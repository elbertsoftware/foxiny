//@flow

import "cross-fetch/polyfill";

import stream from "stream";
import * as validation from "../../../src/utils/addressUtils/validation";

// import test data
const validationTestData = require("./testData/addressUtils.validation.json");

describe("Validation functions tests", () => {
  for (let i = 0; i < validationTestData.length; i++) {
    if (validationTestData[i].expected === true) {
      test("should validate address input", async () => {
        const data = validation.validateAddressInput(
          validationTestData[i].data,
        );
        expect(data).not.toBeUndefined();
        expect(data.name).not.toBeUndefined();
      });
    } else {
      test("should invalidate address input", async () => {
        expect(() =>
          validation.validateAddressInput(validationTestData[i].data),
        ).toThrow();
      });
    }
  }
});
