// @flow

import stream from "stream";
import prisma from "../../../src/utils/prisma";
import * as s3 from "../../../src/utils/s3Uploader";

import seedTestData, {
  seedUserOne,
} from "../userTests/testData/seed-test-data";

// fake reading stream
const _SAMPLE_IMG_FILE = new stream.Readable();
_SAMPLE_IMG_FILE.push("hello");
_SAMPLE_IMG_FILE.push(null);

describe("Test aws s3", () => {
  beforeEach(seedTestData);
  test("should upload", async () => {
    const upload = {
      createReadStream: _SAMPLE_IMG_FILE,
      filename: "test.jpg",
      mimetype: "image/jpg",
      encoding: "7 bit",
    };
    expect(seedUserOne.user.id).not.toBeNull();
    await expect(() =>
      s3.s3ProfileMediaUploader(prisma, upload, seedUserOne.user.id),
    ).not.toThrow();
  });
});
