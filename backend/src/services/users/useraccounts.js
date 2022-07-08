import messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import { TrophyTrophy } from "../../data/db/trophy.db.js";

export async function onReceiveTrophyCollectedMessage(collectorUserId, collectedTrophyId) {
  // TODO: Update UserDB
  var trophy = TrophyTrophy.getTrophyScore(collectedTrophyId);

  User.incrementTrophyScore(collectorUserId, trophy.score);

  messageManager.publishUserScoreUpdatedMessage(collectorUserId);
}

export async function getUserProfile(userId) {
  return await User.findUser(userId).exec();
}

export async function signOut(){
    // issue: should not be here?
}

export async function searchUser(query) {
  return await User.searchUser(query);
}
