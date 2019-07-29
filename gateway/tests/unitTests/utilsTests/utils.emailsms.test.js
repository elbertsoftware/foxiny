// @flow

import * as email from "../../../src/utils/email";
import * as sms from "../../../src/utils/sms";
import * as smsVN from "../../../src/utils/smsVN";

const emailTestData = require("./testData/email.json");

describe("Email/SMS tests", () => {
  emailTestData.forEach(group => {
    switch (group.name) {
      case "sendConfirmationEmail":
        describe("Send confirmation email", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should send confirmation email", () => {
                expect(() =>
                  email.sendConfirmationEmail(
                    group.data[i].name,
                    group.data[i].to,
                    group.data[i].code,
                  ),
                ).not.toThrow();
              });
            }
          }
        });
        break;
      case "sendSMS":
        describe("Send confirmation text (TWILIO)", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should send confirmation text", () => {
                expect(() =>
                  sms.sendConfirmationText(
                    group.data[i].name,
                    group.data[i].to,
                    group.data[i].code,
                  ),
                ).not.toThrow();
              });
            }
          }
        });
        break;
      case "sendSMSVN":
        describe("Send confirmation text (VHAT ESMS)", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should send confirmation text", () => {
                expect(() =>
                  smsVN.sendConfirmationEsms(
                    group.data[i].name,
                    group.data[i].to,
                    group.data[i].code,
                  ),
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
