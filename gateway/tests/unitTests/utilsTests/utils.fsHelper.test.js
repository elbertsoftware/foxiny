//@flow

import stream from "stream";

import * as fsHelper from "../../../src/utils/fsHelper";

const fsHelperTestData = require("./testData/fsHelper.json");

// fake reading stream
const _SAMPLE_IMG_FILE = new stream.Readable();
_SAMPLE_IMG_FILE.push("hello");
_SAMPLE_IMG_FILE.push(null);

describe("Reading File", () => {
  fsHelperTestData.forEach(group => {
    switch (group.name) {
      case "getFileInfo":
        describe("Get file information", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should get image file information", async () => {
                const data = await fsHelper.getFileInfo(
                  "hello.jpg",
                  "abc123",
                  _SAMPLE_IMG_FILE,
                );
                expect(data).not.toBeNull();
                expect(data.ext).toBe("jpg");
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
