import { jest } from "@jest/globals";

import * as leaderboard from "../leaderboard.js";
import { User } from "../../../data/db/user.db.js";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";

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