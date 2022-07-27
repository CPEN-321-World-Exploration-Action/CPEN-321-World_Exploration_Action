import * as messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import * as googleSignIn from "../../data/external/googlesignin.external.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

export async function onReceiveTrophyCollectedMessage(message) {
  await User.incrementTrophyScore(message.userId, message.trophyScore);
  messageManager.publishNewMessage({
    type: "user_score_updated",
    userId: message.userId,
  });
}

export async function getUserProfile(userId) {
  const userDocument = await User.findUser(userId);
  if (!userDocument) {
    throw new NotFoundError("Could not find the user");
  }
  const user = userDocument.toObject();
  user.rank = await User.computeUserRank(userId);
  return user;
}

export async function uploadFcmToken(userId, fcmToken) {
  await User.updateFcmToken(userId, fcmToken);
}

export async function loginWithGoogle(idToken) {
  let userId, idTokenPayload;
  try {
    ({userId, payload: idTokenPayload} = await googleSignIn.verifyUser(idToken));
  } catch (err) {
    console.log(err);
    throw new BadRequestError(`Unable to verify the ID Token: ${idToken}`);
  }

  let user = await getUserProfile(userId);
  if (user) {
    return user;
  } else {
    // Add to payload so payload can be used to create profile with one object
    idTokenPayload.user_id = userId;
    return await createUserProfile(idTokenPayload);
  }
}

export async function searchUser(query) {
  return await User.searchUser(query);
}

export async function signOut(userId) {
  console.log(`User ${userId} has signed out`);
}

async function createUserProfile(body) {
  return await User.create(body);
}

/* Functions for Tests */

export async function testerLogin() {
  await createTestUsers();
  return await User.findUser("_test_user_1");
}

async function createTestUsers() {
  const testUser1 = {
    user_id: "_test_user_1",
    name: "Test User 1",
    email: "testuser1@wea.com",
    picture: "https://avatars.githubusercontent.com/u/20661066",
    friends: ["_test_user_2"],
    score: 99,
    fcm_token: null,
  };
  const testUser2 = {
    user_id: "_test_user_2",
    name: "Test User 2",
    email: "testuser2@wea.com",
    picture: "https://avatars.githubusercontent.com/u/198419",
    friends: ["_test_user_1"],
    score: 156,
    fcm_token: null,
  };
  const testUser3 = {
    user_id: "_test_user_3",
    name: "Test User 3",
    email: "testuser3@wea.com",
    picture: "https://avatars.githubusercontent.com/u/4498198",
    friends: [],
    score: 321,
    fcm_token: null,
  };
  const testUser4 = {
    user_id: "_test_user_4",
    name: "Test User 4",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 158,
    fcm_token: null,
  };
  await upsertUser(testUser1);
  await upsertUser(testUser2);
  await upsertUser(testUser3);
  await upsertUser(testUser4);
}

async function upsertUser(user) {
  const result = await User.updateOne(
      { user_id: user.user_id },
      user,
      { upsert: true }
  );
  if (result.matchedCount == 0 && result.upsertedCount == 0) {
      throw new Error("upsertUser failed");
  }
}

// dev functions
// export async function createUser(req, res) {
//   const user = await User.create(req.body);
//   res.status(201).json({ user });
// }

// export async function getAllUsers(){
//   return await User.find({});
// }

// export async function deleteUser(user_id){
//   return await User.findOneAndDelete({user_id:user_id}, {})
// }
