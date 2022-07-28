import { jest } from "@jest/globals";
import mongoose from "mongoose";

import * as leaderboard from "../leaderboard.js";
import { User } from "../../../data/db/user.db.js";
import { BadRequestError, NotFoundError, NotInDBError, InputError } from "../../../utils/errors.js";
import { get } from "mongoose";

jest.mock("../../../data/external/fcm.external.js"); // have to mock fcm 

/*
leaderboard.willChangeGlobalLeaderboard = jest.fn(
  async (userId, trophyId, trophyScore) => {
    const message = {
      type: "trophy_collected",
      userId,
      trophyId,
      trophyScore,
    };
    return message;
  }
);
*/

async function initialize() {
  await initialize_oldleaderboard();
  await initialize_subscribers();
}

async function initialize_oldleaderboard() {
  leaderboard.oldLeaderboard = ["User1", "User2", "User3"];
}

async function initialize_subscribers() {
  leaderboard.subscribers = new Map();

  leaderboard.subscribers.set("User2", { fcmToken: "User2Token", expireTime: 9999999999 });
  leaderboard.subscribers.set("User4", { fcmToken: "User4Token", expireTime: 9999999999 });
}


// subscribeUpdate complete
describe("Leaderboard Module subscribeUpdate Test", () => {

  test("subscribeUpdate", async () => {
    // refresh
    await connectToDatabase("mongodb://localhost:27017/leaderboard");
    await dropAndDisconnectDatabase_test();

    await connectToDatabase("mongodb://localhost:27017/leaderboard");

    const userId = "User";
    const token = "UserToken";

    await User.create({ user_id: userId });

    const time = await leaderboard.subscribeUpdate(userId, token);

    expect(time).toBeGreaterThan(new Date().getTime());
    expect(leaderboard.subscribers.get(userId)).toEqual({ fcmToken: token, expireTime: time });
    await dropAndDisconnectDatabase_test();
  });

  test("subscribeUpdate_invalid_input", async () => {
    await connectToDatabase("mongodb://localhost:27017/leaderboard");

    const userId = "User";
    const token = "UserToken";

    expect(async () => await leaderboard.subscribeUpdate(null, token)).rejects.toThrow(InputError);
    expect(async () => await leaderboard.subscribeUpdate(userId, null)).rejects.toThrow(InputError);
    await dropAndDisconnectDatabase_test();
  });

  test("subscribeUpdate_user_not_in_DB", async () => {
    await connectToDatabase("mongodb://localhost:27017/leaderboard");

    const userId = "UserNotInDB";
    const token = "UserToken";

    expect(async () => await leaderboard.subscribeUpdate(userId, token)).rejects.toThrow(NotInDBError);
    await dropAndDisconnectDatabase_test();
  });
}
);

// getFriendLeaderboard complete
describe("Leaderboard Module getFriendLeaderboard Test", () => {
  test("getFriendLeaderboard success", async () => {
    // refresh
    await connectToDatabase("mongodb://localhost:27017/leaderboard");
    await dropAndDisconnectDatabase_test();

    await connectToDatabase("mongodb://localhost:27017/leaderboard");

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

    await dropAndDisconnectDatabase_test();
  });

  test("getFriendLeaderboard user has no friend", async () => {
    await connectToDatabase("mongodb://localhost:27017/leaderboard");

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

    await dropAndDisconnectDatabase_test();
  });

  test("getFriendLeaderboard user not in DB", async () => {
    await connectToDatabase("mongodb://localhost:27017/leaderboard");

    const userId = "UserNotInDB";

    expect(async () => await leaderboard.getFriendLeaderboard(userId)).rejects.toThrow(NotInDBError);

    await dropAndDisconnectDatabase_test();
  });

  test("getFriendLeaderboard user invalid", async () => {
    await connectToDatabase("mongodb://localhost:27017/leaderboard");

    expect(async () => await leaderboard.getFriendLeaderboard(null)).rejects.toThrow(InputError);
    expect(async () => await leaderboard.getFriendLeaderboard(undefined)).rejects.toThrow(InputError);

    await dropAndDisconnectDatabase_test();
  });
}
);

// getGlobalLeaderboard complete
describe("Leaderboard Module getGlobalLeaderboard Test", () => {
  test("getGlobalLeaderboard_not_exceed_10", async () => {
    // refresh
    await connectToDatabase("mongodb://localhost:27017/leaderboard");
    await dropAndDisconnectDatabase_test();

    await connectToDatabase("mongodb://localhost:27017/leaderboard");
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

    await dropAndDisconnectDatabase_test();
  });

  test("getGlobalLeaderboard_exceed_10", async () => {
    await connectToDatabase("mongodb://localhost:27017/leaderboard");

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

    await dropAndDisconnectDatabase_test();
  });
}
);

export async function connectToDatabase(dbUrl) {
  await mongoose.connect(dbUrl);
}

export async function dropAndDisconnectDatabase() {
  /*
  try {
    await mongoose.connection.db.dropDatabase();
  } catch (err) { }
  await mongoose.connection.close();
  */
}

export async function dropAndDisconnectDatabase_test() {
  try {
    await mongoose.connection.db.dropDatabase();
  } catch (err) { }
  await mongoose.connection.close();
}