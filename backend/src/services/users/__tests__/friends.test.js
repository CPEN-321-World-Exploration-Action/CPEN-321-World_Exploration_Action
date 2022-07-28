import { jest } from "@jest/globals";

import * as friends from "../friends.js";
import * as fcm from "../../../data/external/fcm.external.js";
import { User } from "../../../data/db/user.db.js";
import { BadRequestError, NotFoundError, InputError } from "../../../utils/errors.js";
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
    expectSameUsers(actualUsers, expectedUserIds);
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

describe("Friends_getFriendRequests", () => {
  test("Friends_getFriendRequests_no_requests", async () => {
    await expect(await friends.getFriendRequests("_test_user_1")).toStrictEqual([]);
  });

  test("Friends_getFriendRequests_no_requests", async () => {
    await friends.sendRequest("_test_user_3", "_test_user_2");
    const requests = await friends.getFriendRequests("_test_user_2");
    expectSameUsers(requests, ["_test_user_3"]);
  });

  test("Friends_getFriendRequests_invalid_input", async () => {
    await expect(async () => await friends.getFriendRequests(null)).rejects.toThrow(TypeError);
  });
});

describe("Friends_sendRequest", () => {
  beforeEach(async () => {
    friends.clearRequests();
    fcm.sendFriendNotification.mockClear();
  });

  test("Friends_getFriendRequests_has_requested_before", async () => {
    await friends.sendRequest("_test_user_3", "_test_user_2");
    fcm.sendFriendNotification.mockClear();

    await expect(async () => await friends.sendRequest("_test_user_3", "_test_user_2")).rejects.toThrow(BadRequestError);
    expect(fcm.sendFriendNotification).toHaveBeenCalledTimes(0);
  });

  test("Friends_getFriendRequests_not_requested_before", async () => {
    await friends.sendRequest("_test_user_3", "_test_user_2");
    await friends.declineUser("_test_user_2", "_test_user_3"); /* This will ensure the request is added */
    expect(fcm.sendFriendNotification).toHaveBeenCalledWith("__test_fcm_token_2", expect.anything(), expect.anything());
  });

  test("Friends_getFriendRequests_nonexisting_sender", async () => {
    await expect(async () => await friends.sendRequest("_test_user_9999", "_test_user_2")).rejects.toThrow(NotFoundError);
    expect(fcm.sendFriendNotification).toHaveBeenCalledTimes(0);
  });

  test("Friends_getFriendRequests_target_has_no_fcm_token", async () => {
    await friends.sendRequest("_test_user_3", "_test_user_1");
    expect(fcm.sendFriendNotification).toHaveBeenCalledTimes(0);
    await friends.declineUser("_test_user_1", "_test_user_3"); /* This will ensure the request is added */
  });

  test("Friends_getFriendRequests_nonexisting_target", async () => {
    await expect(async () => await friends.sendRequest("_test_user_1", "_test_user_999")).rejects.toThrow(NotFoundError);
    expect(fcm.sendFriendNotification).toHaveBeenCalledTimes(0);
  });

  test("Friends_getFriendRequests_same_sender_and_target", async () => {
    await expect(async () => await friends.sendRequest("_test_user_1", "_test_user_1")).rejects.toThrow(BadRequestError);
  });

  test("Friends_getFriendRequests_null_input", async () => {
    await expect(async () => await friends.sendRequest(null, null)).rejects.toThrow(InputError);
  });
});

describe("Friends_deleteFriend", () => {
  test("Friends_deleteFriend_basic", async () => {
    await friends.deleteFriend("_test_user_1", "_test_user_2");
    await expect(await friends.retrieveFriends("_test_user_1")).toStrictEqual([]);
    await expect(await friends.retrieveFriends("_test_user_2")).toStrictEqual([]);
    await initializeDatabase();
  });

  test("Friends_deleteFriend_not_friend", async () => {
    await expect(async () => await friends.deleteFriend("_test_user_1", "_test_user_1")).rejects.toThrow(BadRequestError);
  });

  test("Friends_deleteFriend_nonexisting_user", async () => {
    await expect(async () => await friends.deleteFriend("_test_user_1324", "_test_user_112")).rejects.toThrow(BadRequestError);
  });

  test("Friends_deleteFriend_invalid_input", async () => {
    await expect(async () => await friends.deleteFriend(null, "_test_user_1")).rejects.toThrow();
  });
});

function expectSameUsers(actualUsers, expectedUserIds) {
  const actualUsersIds = actualUsers.map(x => x.user_id);
  expect(actualUsersIds).toStrictEqual(expectedUserIds);
}

async function initializeDatabase() {
  const testUser1 = {
    user_id: "_test_user_1",
    name: "Test User 1",
    email: "testuser1@wea.com",
    picture: "",
    friends: ["_test_user_2"],
    score: 99,
    fcm_token: null,
  };
  const testUser2 = {
    user_id: "_test_user_2",
    name: "Test User 2",
    email: "testuser2@wea.com",
    picture: "",
    friends: ["_test_user_1"],
    score: 156,
    fcm_token: "__test_fcm_token_2",
  };
  const testUser3 = {
    user_id: "_test_user_3",
    name: "Test User 3",
    email: "testuser3@wea.com",
    picture: "",
    friends: [],
    score: 321,
    fcm_token: "__test_fcm_token_3",
  };
  await User.upsertUser(testUser1);
  await User.upsertUser(testUser2);
  await User.upsertUser(testUser3);
}
