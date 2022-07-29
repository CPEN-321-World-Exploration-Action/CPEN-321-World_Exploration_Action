import { jest } from "@jest/globals";

import * as leaderboard from "../leaderboard.js";
import * as fcm from "../../../data/external/fcm.external.js";
import { User } from "../../../data/db/user.db.js";
import { BadRequestError, NotFoundError, NotInDBError, InputError } from "../../../utils/errors.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../../utils/database.js";

jest.mock("../../../data/external/fcm.external.js"); // have to mock fcm 

const leaderboardSize = leaderboard.numberOfUsersOnLeaderboard;


beforeAll(async () => {
  await connectToDatabase(URL);
  leaderboard.setSubscriptionValidDuration(3000);
})

afterAll(async () => {
  await dropAndDisconnectDatabase();
})

beforeEach(async () => {
  await User.deleteMany({})
})

afterEach(async () => {
  leaderboard.setNumberOfUsersOnLeaderboard(leaderboardSize);
})

describe("Leaderboard Module onReceiveUserScoreUpdatedMessage Test", () => {
  test("Top 1 changed and user dropped from the leaderboard", async () => {
    leaderboard.setNumberOfUsersOnLeaderboard(3);

    await User.create({ user_id: "User_1", score: 40, fcm_token: "fcm_token_1" });
    await User.create({ user_id: "User_2", score: 30, fcm_token: "fcm_token_2" });
    await User.create({ user_id: "User_3", score: 20, fcm_token: "fcm_token_3" });
    await User.create({ user_id: "User_4", score: 10, fcm_token: "fcm_token_4" });

    await leaderboard.onReceiveUserScoreUpdatedMessage({ userId: "User_1" });
    
    fcm.sendLeaderboardUpdateMessage.mockClear();
    fcm.sendNewChampionNotification.mockClear();
    fcm.sendFriendNotification.mockClear();

    await leaderboard.subscribeUpdate("User_1", "fcm_token_1");
    await leaderboard.subscribeUpdate("User_3", "fcm_token_3");

    await User.updateOne({ user_id: "User_4" }, { $set: { score: 100 } });
    await leaderboard.onReceiveUserScoreUpdatedMessage({ userId: "User_4" });

    expect(fcm.sendLeaderboardUpdateMessage).toHaveBeenCalledWith(["fcm_token_1", "fcm_token_3"]);
    expect(fcm.sendNewChampionNotification).toHaveBeenCalledTimes(1);
    expect(fcm.sendNormalNotifications).toHaveBeenCalledWith(["fcm_token_3"], expect.anything(), expect.anything());
  });
});

// subscribeUpdate complete
describe("Leaderboard Module subscribeUpdate Test", () => {

  test("subscribeUpdate", async () => {
    const userId = "User";
    const token = "UserToken";

    await User.create({ user_id: userId });

    const time = await leaderboard.subscribeUpdate(userId, token);

    expect(time).toBeGreaterThan(new Date().getTime());
    expect(leaderboard.subscribers.get(userId)).toEqual({ fcmToken: token, expireTime: time });
  });

  test("subscribeUpdate_invalid_input", async () => {
    const userId = "User";
    const token = "UserToken";

    expect(async () => await leaderboard.subscribeUpdate(null, token)).rejects.toThrow(InputError);
    expect(async () => await leaderboard.subscribeUpdate(userId, null)).rejects.toThrow(InputError);
  });

  test("subscribeUpdate_user_not_in_DB", async () => {
    const userId = "UserNotInDB";
    const token = "UserToken";

    expect(async () => await leaderboard.subscribeUpdate(userId, token)).rejects.toThrow(NotInDBError);
  });
}
);

// getFriendLeaderboard complete
describe("Leaderboard Module getFriendLeaderboard Test", () => {
  test("getFriendLeaderboard success", async () => {
    const userId = "User";

    await User.create({ user_id: userId });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    await User.updateOne({ user_id: userId }, { $set: { score: 0, friends: ["User_1", "User_2"] } });
    await User.updateOne({ user_id: "User_1" }, { $set: { score: 1, friends: [userId] } });
    await User.updateOne({ user_id: "User_2" }, { $set: { score: 2, friends: [userId] } });

    let user_list = await leaderboard.getFriendLeaderboard(userId);

    expect(user_list[0]).toHaveProperty("user_id", "User_2");
    expect(user_list[1]).toHaveProperty("user_id", "User_1");
    expect(user_list[2]).toHaveProperty("user_id", userId);
  });

  test("getFriendLeaderboard user has no friend", async () => {
    const userId = "User";

    await User.create({ user_id: userId });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    await User.updateOne({ user_id: userId }, { $set: { score: 0 } });
    await User.updateOne({ user_id: "User_1" }, { $set: { score: 1 } });
    await User.updateOne({ user_id: "User_2" }, { $set: { score: 2 } });

    let user_list = await leaderboard.getFriendLeaderboard(userId);

    expect(user_list[0]).toHaveProperty("user_id", userId);

    expect(user_list.length).toEqual(1);
  });

  test("getFriendLeaderboard user not in DB", async () => {
    const userId = "UserNotInDB";

    expect(async () => await leaderboard.getFriendLeaderboard(userId)).rejects.toThrow(NotInDBError);
  });

  test("getFriendLeaderboard user invalid", async () => {
    expect(async () => await leaderboard.getFriendLeaderboard(null)).rejects.toThrow(InputError);
    expect(async () => await leaderboard.getFriendLeaderboard(undefined)).rejects.toThrow(InputError);
  });
}
);

// getGlobalLeaderboard complete
describe("Leaderboard Module getGlobalLeaderboard Test", () => {
  test("getGlobalLeaderboard_not_exceed_10", async () => {
    await User.create({ user_id: "User_0" });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    await User.updateOne({ user_id: "User_0" }, { $set: { score: 0 } });
    await User.updateOne({ user_id: "User_1" }, { $set: { score: 1 } });
    await User.updateOne({ user_id: "User_2" }, { $set: { score: 2 } });

    let user_list = await leaderboard.getGlobalLeaderboard();

    expect(user_list[0]).toHaveProperty("user_id", "User_2");
    expect(user_list[1]).toHaveProperty("user_id", "User_1");
    expect(user_list[2]).toHaveProperty("user_id", "User_0");
    expect(user_list.length).toBeLessThan(leaderboard.numberOfUsersOnLeaderboard);
  });

  test("getGlobalLeaderboard_exceed_10", async () => {
    await User.create({ user_id: "User_0" });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });
    await User.create({ user_id: "User_3" });
    await User.create({ user_id: "User_4" });
    await User.create({ user_id: "User_5" });
    await User.create({ user_id: "User_6" });
    await User.create({ user_id: "User_7" });
    await User.create({ user_id: "User_8" });
    await User.create({ user_id: "User_9" });
    await User.create({ user_id: "User_10" });

    await User.updateOne({ user_id: "User_0" }, { $set: { score: 0 } });
    await User.updateOne({ user_id: "User_1" }, { $set: { score: 1 } });
    await User.updateOne({ user_id: "User_2" }, { $set: { score: 2 } });
    await User.updateOne({ user_id: "User_3" }, { $set: { score: 3 } });
    await User.updateOne({ user_id: "User_4" }, { $set: { score: 4 } });
    await User.updateOne({ user_id: "User_5" }, { $set: { score: 5 } });
    await User.updateOne({ user_id: "User_6" }, { $set: { score: 6 } });
    await User.updateOne({ user_id: "User_7" }, { $set: { score: 7 } });
    await User.updateOne({ user_id: "User_8" }, { $set: { score: 8 } });
    await User.updateOne({ user_id: "User_9" }, { $set: { score: 9 } });
    await User.updateOne({ user_id: "User_10" }, { $set: { score: 10 } });

    let user_list = await leaderboard.getGlobalLeaderboard();

    expect(user_list[0]).toHaveProperty("user_id", "User_10");
    expect(user_list[1]).toHaveProperty("user_id", "User_9");
    expect(user_list[2]).toHaveProperty("user_id", "User_8");
    expect(user_list[3]).toHaveProperty("user_id", "User_7");
    expect(user_list[4]).toHaveProperty("user_id", "User_6");
    expect(user_list[5]).toHaveProperty("user_id", "User_5");
    expect(user_list[6]).toHaveProperty("user_id", "User_4");
    expect(user_list[7]).toHaveProperty("user_id", "User_3");
    expect(user_list[8]).toHaveProperty("user_id", "User_2");
    expect(user_list[9]).toHaveProperty("user_id", "User_1");
    expect(user_list.length).toEqual(leaderboard.numberOfUsersOnLeaderboard);
  });
});
