import { jest } from "@jest/globals";

import * as friends from "../friends.js";
import { User } from "../../../data/db/user.db.js";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../../utils/database.js";

jest.mock("../../../data/external/fcm.external.js");

const testDbUri = "mongodb://localhost:27017/test_WEA";

beforeAll(async () => {
  await connectToDatabase(testDbUri);
  initializeDatabase();
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

describe("Friends_retrieveFriends", () => {
  test("Friends_retrieveFriends_nonexistent_user", async () => {
    await expect(
      async () => await friends.retrieveFriends("abcdefg")
    ).rejects.toThrow(NotFoundError);
  });

  test("Friends_retrieveFriends_user_has_friend", async () => {
    const expectedUserIds = ["_test_user_2"];
    const actualUsers = await friends.retrieveFriends("_test_user_1");
    const actualUserIds = actualUsers.map(x => x.user_id);
    await expect(expectedUserIds).toStrictEqual(actualUserIds);
  });

  test("Friends_retrieveFriends_user_has_no_friend", async () => {
    await expect(await friends.retrieveFriends("_test_user_3"))
      .toStrictEqual([]);
  });

  test("Friends_retrieveFriends_invalid_input", async () => {
    await expect(async () => {
      await friends.retrieveFriends(null);
    }).rejects.toThrow(TypeError);
  });
});

async function initializeDatabase() {
  const testUser1 = {
    user_id: "_test_user_1",
    name: "Test User 1",
    email: "testuser1@wea.com",
    picture: "",
    friends: ["_test_user_2"],
    score: 99,
  };
  const testUser2 = {
    user_id: "_test_user_2",
    name: "Test User 2",
    email: "testuser2@wea.com",
    picture: "",
    friends: ["_test_user_1"],
    score: 156,
  };
  const testUser3 = {
    user_id: "_test_user_3",
    name: "Test User 3",
    email: "testuser3@wea.com",
    picture: "",
    friends: [],
    score: 321,
  };
  await User.upsertUser(testUser1);
  await User.upsertUser(testUser2);
  await User.upsertUser(testUser3);
}
