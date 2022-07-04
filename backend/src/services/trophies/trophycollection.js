import messageManager from "../../utils/message-manager.js";

export async function collectTrophy(userId, trophyId) {
  messageManager.publishTrophyCollectedMessage(userId, trophyId);
  return {
    success: true,
  };
}
