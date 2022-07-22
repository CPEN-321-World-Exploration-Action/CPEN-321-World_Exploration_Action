import * as messageManager from "../../utils/message-manager.js";
import { TrophyUser, TrophyTrophy } from "../../data/db/trophy.db.js";
import { BadRequestError } from "../../utils/errors.js";

export async function collectTrophy(userId, trophyId) {

  //issue: it does not check duplication

  const success = await TrophyUser.removeUncollectedTrophy(userId, trophyId);
  if (!success) {
    throw new BadRequestError("Invalid userId or trophyId");
  }

  await TrophyUser.addCollectedTrophy(userId, trophyId);

  await TrophyTrophy.incrementNumberOfCollector(trophyId, userId);

  const trophyScore = await TrophyTrophy.getTrophyScore(trophyId);

  const message = buildTrophyCollectedMessage(userId, trophyId, trophyScore);
  messageManager.publishNewMessage(message);
}

function buildTrophyCollectedMessage(userId, trophyId, trophyScore) {
  const message = {
    type: "trophy_collected",
    userId,
    trophyId,
    trophyScore,
  };
  return message;
}
