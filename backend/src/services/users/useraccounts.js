import * as messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";

export async function onReceiveTrophyCollectedMessage(message) {
  // TODO: Test
  await User.incrementTrophyScore(message.userId, message.trophyScore);
  messageManager.publishNewMessage({
    type: "user_score_updated",
    userId: message.userId,
  });
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
