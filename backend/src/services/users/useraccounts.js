import * as messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import * as googleSignIn from "../../data/external/googlesignin.external.js";
import { BadRequestError, NotFoundError, InputError, NotInDBError } from "../../utils/errors.js";

export async function onReceiveTrophyCollectedMessage(message) {
  if (!message.userId || !message.trophyScore || message.userId == null || message.trophyScore == null) {
    throw new InputError();
  }

  if (!(await User.findOne({ user_id: message.userId }))) {
    throw new NotInDBError();
  }

  await User.incrementTrophyScore(message.userId, message.trophyScore);
  messageManager.publishNewMessage({
    type: "user_score_updated",
    userId: message.userId,
  });
}

export async function getUserProfile(userId) {
  if (!userId || userId == null) {
    throw new InputError();
  }

  const userDocument = await User.findUser(userId);
  if (!userDocument) {
    throw new NotFoundError("Could not find the user");
  }
  const user = userDocument.toObject();
  user.rank = await User.computeUserRank(userId);
  return user;
}

export async function uploadFcmToken(userId, fcmToken) {
  if (!userId || !fcmToken || userId == null || fcmToken == null) {
    throw new InputError();
  }

  if (!(await User.findOne({ user_id: userId }))) {
    throw new NotInDBError();
  }

  await User.updateFcmToken(userId, fcmToken);
}

export async function loginWithGoogle(idToken) {
  let userId, idTokenPayload;
  try {
    ({ userId, payload: idTokenPayload } = await googleSignIn.verifyUser(idToken));
  } catch (err) {
    //console.log(err);
    throw new BadRequestError(`Unable to verify the ID Token: ${idToken}`);
  }

  try {
    let user = await getUserProfile(userId);
    return user;
  }
  catch (e) {
    //console.log(e);
    idTokenPayload.user_id = userId;
    return await createUserProfile(idTokenPayload);
  }
}

export async function searchUser(query) {
  if (query == null || !query) {
    throw new InputError();
  }

  return await User.searchUser(query);
}

export async function signOut(userId) {
  if (!userId || userId == null) {
    throw new InputError();
  }

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
  await User.upsertUser(testUser1);
  await User.upsertUser(testUser2);
  await User.upsertUser(testUser3);
  await User.upsertUser(testUser4);
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
