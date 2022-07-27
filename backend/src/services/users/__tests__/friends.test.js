import { jest } from "@jest/globals";

import * as friends from "../friends.js";

jest.mock("../../../data/external/fcm.external.js");

describe("Friends", () => {
  test("retrieveFriends_invalid_input", async () => {
    await expect(async () => {
      await friends.retrieveFriends(null);
    }).rejects.toThrow();
  });
});
