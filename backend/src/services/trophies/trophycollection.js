import * as messageManager from "../../utils/message-manager.js";
import { TrophyUser, TrophyTrophy } from "../../data/db/trophy.db.js";

export async function collectTrophy(userId, trophyId) {

  //issue: it does not check duplication

  TrophyUser.removeUncollectedTrophy(userId, trophyId);

  TrophyUser.addCollectedTrophy(userId, trophyId);

  // // issue: what is newTags
  // // TrophyTrophy.updateUserTags(newTags);

  TrophyTrophy.incrementNumberOfCollector(trophyId, userId);

  const trophyScore = await TrophyTrophy.getTrophyScore(trophyId);

  //const trophyScore = 1;

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
