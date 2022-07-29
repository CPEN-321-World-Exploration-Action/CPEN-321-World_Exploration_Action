import { jest } from "@jest/globals";

import * as useraccounts from "../useraccounts";
import { User } from "../../../data/db/user.db.js";
import { BadRequestError, NotFoundError, NotInDBError, InputError } from "../../../utils/errors.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../../utils/database.js";

import * as messageManager from "../../../utils/message-manager.js"
import * as googleSignIn from "../../../data/external/googlesignin.external.js"

jest.mock("../../../data/external/fcm.external.js"); // have to mock fcm 
jest.mock("../../../utils/message-manager.js");
jest.mock("../../../data/external/googlesignin.external.js");

const URL = "mongodb://localhost:27017/test_WEA_useraccounts";

beforeAll(async () => {
  await connectToDatabase(URL);
})

afterAll(async () => {
  await dropAndDisconnectDatabase();
})

beforeEach(async () => {
  await User.deleteMany({})
})

// onReceiveTrophyCollectedMessage complete
describe("Useraccounts Module onReceiveTrophyCollectedMessage Test", () => {

  test("onReceiveTrophyCollectedMessage", async () => {
    const userId = "User";

    await User.create({ user_id: userId });
    await User.updateOne({ user_id: userId }, { $set: { score: 0 } });

    await useraccounts.onReceiveTrophyCollectedMessage({
      userId: userId,
      trophyScore: 1
    });

    expect((await User.findOne({ user_id: userId }).exec()).score).toEqual(1);
    expect(messageManager.publishNewMessage).toHaveBeenCalledWith({
      type: "user_score_updated",
      userId: userId,
    });
  });

  test("onReceiveTrophyCollectedMessage user invalid", async () => {
    const userId = "User";

    await User.create({ user_id: userId });
    await User.updateOne({ user_id: userId }, { $set: { score: 109 } });

    expect(async () => await useraccounts.onReceiveTrophyCollectedMessage({
      userId: null,
      trophyScore: 1
    })).rejects.toThrow(InputError);

    expect((await User.findOne({ user_id: userId }).exec()).score).toEqual(109);
  });

  test("onReceiveTrophyCollectedMessage user is not in DB", async () => {
    const userId = "UserNotInDB";

    expect(async () => await useraccounts.onReceiveTrophyCollectedMessage({
      userId: userId,
      trophyScore: 1
    })).rejects.toThrow(NotInDBError);
  });

  test("onReceiveTrophyCollectedMessage score invalid", async () => {
    const userId = "User";

    await User.create({ user_id: userId });
    await User.updateOne({ user_id: userId }, { $set: { score: 109 } });

    expect(async () => await useraccounts.onReceiveTrophyCollectedMessage({
      userId: userId,
      trophyScore: null
    })).rejects.toThrow(InputError);

    expect((await User.findOne({ user_id: userId }).exec()).score).toEqual(109);
  });

  test("onReceiveTrophyCollectedMessage no user", async () => {
    expect(async () => await useraccounts.onReceiveTrophyCollectedMessage({
      trophyScore: 1
    })).rejects.toThrow(InputError);
  });

  test("onReceiveTrophyCollectedMessage no score", async () => {
    const userId = "User";

    await User.create({ user_id: userId });
    await User.updateOne({ user_id: userId }, { $set: { score: 109 } });

    expect(async () => await useraccounts.onReceiveTrophyCollectedMessage({
      userId: userId
    })).rejects.toThrow(InputError);

    expect((await User.findOne({ user_id: userId }).exec()).score).toEqual(109);
  });

  test("onReceiveTrophyCollectedMessage both field are missing", async () => {
    expect(async () => await useraccounts.onReceiveTrophyCollectedMessage({
    })).rejects.toThrow(InputError);
  });

}
);

// getUserProfile complete
describe("Useraccounts Module getUserProfile Test", () => {
  test("getUserProfile", async () => {
    const userId = "User";

    await User.create({ user_id: userId });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    await User.updateOne({ user_id: userId }, { $set: { score: 0 } });
    await User.updateOne({ user_id: "User_1" }, { $set: { score: 1 } });
    await User.updateOne({ user_id: "User_2" }, { $set: { score: 2 } });

    const userWithRank = await useraccounts.getUserProfile(userId);
    expect(userWithRank.user_id).toEqual(userId);
    expect(userWithRank.rank).toEqual(3);
  });

  test("getUserProfile user not in DB", async () => {
    const userId = "UserNotInDB";

    expect(async () => await useraccounts.getUserProfile(userId)).rejects.toThrow(NotFoundError);
  });

  test("getUserProfile user is invalid", async () => {
    expect(async () => await useraccounts.getUserProfile(null)).rejects.toThrow(InputError);
  });
});

// uploadFcmToken complete
describe("Useraccounts Module uploadFcmToken Test", () => {

  test("uploadFcmToken", async () => {
    const userId = "User";
    const token = "New";

    await User.create({ user_id: userId });

    await User.updateOne({ user_id: userId }, { $set: { fcm_token: "Old" } });

    await useraccounts.uploadFcmToken(userId, token);

    expect((await User.findOne({ user_id: userId }).exec()).fcm_token).toEqual(token);
  });

  test("uploadFcmToken user not in DB", async () => {
    const userId = "UserNotInDB";
    const token = "New";

    expect(async () => await useraccounts.uploadFcmToken(userId, token)).rejects.toThrow(NotInDBError);
  });

  test("uploadFcmToken user is invalid", async () => {
    const userId = null;
    const token = "New";

    expect(async () => await useraccounts.uploadFcmToken(userId, token)).rejects.toThrow(InputError);
  });

  test("uploadFcmToken token is invalid", async () => {
    const userId = "User";
    const token = null;

    expect(async () => await useraccounts.uploadFcmToken(userId, token)).rejects.toThrow(InputError);
  });
});

// loginWithGoogle complete
describe("Useraccounts Module loginWithGoogle Test", () => {

  test("loginWithGoogle", async () => {
    const idToken = "User";

    await User.create({
      user_id: "438952804820"
    });

    await User.updateOne({ user_id: "438952804820" }, {
      $set: {
        name: "Joseph Smith",
        email: "joseph.smith@gmail.com",
        picture: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
        score: 890,
        rank: 8,
      }
    });

    const user = await useraccounts.loginWithGoogle(idToken);

    expect(googleSignIn.verifyUser).toHaveBeenCalledWith(idToken);
    expect(user.user_id).toEqual("438952804820");
    expect(user.rank).toEqual(1);
  });

  test("loginWithGoogle token invalid", async () => {
    expect(async () => await useraccounts.loginWithGoogle(null)).rejects.toThrow(BadRequestError);
  });

  test("loginWithGoogle user not in DB", async () => {
    const idToken = "User";

    const user = await useraccounts.loginWithGoogle(idToken);

    expect(googleSignIn.verifyUser).toHaveBeenCalledWith(idToken);
    expect(user.user_id).toEqual("438952804820");
    expect(user.rank).toEqual(8);
  });
});

// searchUser complete
describe("Useraccounts Module searchUser Test", () => {

  test("searchUser userId", async () => {
    const userId = "User_0";

    await User.create({ user_id: userId });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    expect((await useraccounts.searchUser(userId)).map(x => x.user_id)).toEqual([userId]);

  });

  test("searchUser email", async () => {
    const userId = "User_0";
    const email = "0Email";

    await User.create({ user_id: userId });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    await User.updateOne({ user_id: userId }, { $set: { email: email } });
    await User.updateOne({ user_id: "User_1" }, { $set: { email: email } });
    await User.updateOne({ user_id: "User_2" }, { $set: { email: "1Email" } });

    const list = (await useraccounts.searchUser(email)).map(x => x.user_id);

    expect(list).toContain(userId);
    expect(list).toContain("User_1");
    expect(list).not.toContain("User_2");

  });

  test("searchUser name", async () => {
    const userId = "User_0";
    const email = "0Email";
    const name = "Mk";

    await User.create({ user_id: userId });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    await User.updateOne({ user_id: userId }, { $set: { email: email } });
    await User.updateOne({ user_id: "User_1" }, { $set: { email: email } });
    await User.updateOne({ user_id: "User_2" }, { $set: { name: name } });

    const list = (await useraccounts.searchUser(name)).map(x => x.user_id);

    expect(list).not.toContain(userId);
    expect(list).not.toContain("User_1");
    expect(list).toContain("User_2");

  });

  test("searchUser name", async () => {
    const userId = "User_0";
    const email = "0Email";
    const name = "Mk";

    await User.create({ user_id: userId });
    await User.create({ user_id: "User_1" });
    await User.create({ user_id: "User_2" });

    await User.updateOne({ user_id: userId }, { $set: { email: email } });
    await User.updateOne({ user_id: "User_1" }, { $set: { email: email } });
    await User.updateOne({ user_id: "User_2" }, { $set: { name: name } });

    expect(await useraccounts.searchUser("NoMatch")).toEqual([]);
  });

  test("searchUser invalid query", async () => {
    expect(async () => await useraccounts.searchUser(null)).rejects.toThrow(InputError);
  });
});

// searchUser complete
describe("Useraccounts Module signOut Test", () => {
  test("signOut Invalid Input", async () => {
    const userId = null;

    expect(async () => await useraccounts.signOut(userId)).rejects.toThrow(InputError);

  });

  test("signOut Not in DB", async () => {
    const userId = "User_0";

    expect((async () => await useraccounts.signOut(userId))).rejects.toThrow(NotInDBError);

  });
});
