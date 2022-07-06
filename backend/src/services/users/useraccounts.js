import messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import { Trophy } from "../../data/db/trophy.db.js";

export async function onReceiveTrophyCollectedMessage(collectorUserId, collectedTrophyId) {
  // TODO: Update UserDB
  var trophy = Trophy.getTrophyScore(collectedTrophyId);

  User.incrementTrophyScore(collectorUserId, trophy.score);

  messageManager.publishUserScoreUpdatedMessage(collectorUserId);
}

export async function getUserProfile(userId) {
  return await User.findUser(userId).exec();
}

export async function signOut(){
    // issue: should not be here?
}
