import * as messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import * as googleSignIn from "../../data/external/googlesignin.external.js";
import { BadRequestError } from "../../utils/errors.js";

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
    return null;
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
    idTokenPayload.user_id = userId
    return await createUserProfile(idTokenPayload);
  }
}

export async function searchUser(query) {
  return await User.searchUser(query);
}

export async function signOut(userId) {
  console.log(`User ${userId} has signed out`);
}

// TODO: internal helper
export async function createUserProfile(body) {
  return await User.create(body);
}


// dev functions
export async function createUser(req, res) {
  const user = await User.create(req.body);
  res.status(201).json({ user });
}

export async function getAllUsers(){
  return await User.find({});
}

export async function deleteUser(user_id){
  return await User.findOneAndDelete({user_id:user_id}, {})
}
