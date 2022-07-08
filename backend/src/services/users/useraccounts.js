import messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import { TrophyUser, TrophyTrophy } from "../../data/db/trophy.db.js";

export async function onReceiveTrophyCollectedMessage(
  collectorUserId,
  collectedTrophyId
) {
  // TODO: Update UserDB
  var trophy = TrophyTrophy.getTrophyScore(collectedTrophyId);

  User.incrementTrophyScore(collectorUserId, trophy.score);

  messageManager.publishUserScoreUpdatedMessage(collectorUserId);
}

export async function getUserProfile(userId) {
  return await User.findUser(userId).exec();
}

export async function signOut() {
  // issue: should not be here?
}

export async function loginWithGoogle(idToken) {
  // issue: what is token
}

export async function extractGoogleID(idToken) {
  // issue: what is token
}

export async function createUserProfile(idToken) {
  // addUser(newUser)
  /*
  user_id: { type: String, index: true, unique: true },
    google_id: { type: String, index: true },
    name: { type: String, index: true },
    email: {
      type: String,
      lowercase: true,
      index: true,
    },
    imageUrl: String,
    friends: [String],
    score: { type: Number, default: 0, index: true },
    fcm_token: String,
    */
}

export async function getProfileImage(userID){
  // issue: said to be determined later..
}

export async function searchUser(query) {
  return await User.searchUser(query);
}