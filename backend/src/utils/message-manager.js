// TODO: make a better one
import * as userAccounts from "../services/users/useraccounts.js";
import * as leaderboard from "../services/users/leaderboard.js";

export default {
  publishTrophyCollectedMessage(collectorUserId, collectedTrophyId) {
    userAccounts
      .onReceiveTrophyCollectedMessage(collectorUserId, collectedTrophyId)
      .catch((err) => {
        console.log(err);
      });
  },

  publishUserScoreUpdatedMessage(userId) {
    leaderboard.onReceiveUserScoreUpdatedMessage(userId).catch((err) => {
      console.log(err);
    });
  },
};
