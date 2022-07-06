import messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";

export async function onReceiveTrophyCollectedMessage(collectorUserId, collectedTrophyId) {
  // TODO: Update UserDB
  messageManager.publishUserScoreUpdatedMessage(collectorUserId);
}

export async function getUserProfile(userId) {
  return await User.findUser(userId).exec();
}

export async function createUserProfile(userId) {
  return await User.addUser(userId).exec();
}