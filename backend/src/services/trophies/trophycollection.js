import messageManager from "../../utils/message-manager.js";
import { TrophyUser, TrophyTrophy} from "../../data/db/trophy.db.js";

export async function collectTrophy(userId, trophyId) {

  TrophyUser.removeUncollectedTrophy(userId, trophyId);

  TrophyUser.addCollectedTrophy(userId, trophyId);

  // issue: what is newTags
  // TrophyTrophy.updateUserTags(newTags);
  TrophyTrophy.incrementNumberOfCollector(trophyId);

  var message = buildTrophyCollectedMessage(userId, trophyId);

  messageManager.publishTrophyCollectedMessage(userId, trophyId);
  return {
    success: true,
  };
  //messageManager.publishNewMessage(message);
}

export async function buildTrophyCollectedMessage(userId, trophyId){


}