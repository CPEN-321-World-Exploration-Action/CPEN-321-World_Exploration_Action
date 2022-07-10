import * as messageManager from "../../utils/message-manager.js";
import { TrophyUser, TrophyTrophy } from "../../data/db/trophy.db.js";
import { User } from "../../data/db/user.db.js";

export async function collectTrophy(userId, trophyId) {
  TrophyUser.removeUncollectedTrophy(userId, trophyId);

  TrophyUser.addCollectedTrophy(userId, trophyId);

  // // issue: what is newTags
  // // TrophyTrophy.updateUserTags(newTags);

  TrophyTrophy.incrementNumberOfCollector(trophyId);

  const trophyScore = await TrophyTrophy.getTrophyScore(message.trophyId);
  //const trophyScore = 1;

  // issue should this be here?
  User.incrementTrophyScore(userId, trophyScore);

  const message = buildTrophyCollectedMessage(userId, trophyId, trophyScore);
  messageManager.publishNewMessage(message);

  return {
    success: true,
  };
}

function buildTrophyCollectedMessage(userId, trophyId, trophyScore) {
  return {
    type: "trophy_collected",
    userId,
    trophyId,
    trophyScore,
  };
}
