import * as userAccounts from "../services/users/useraccounts.js";
import * as leaderboard from "../services/users/leaderboard.js";

export function publishNewMessage(message) {
  notifySubscribers(message).catch((err) => {
    console.log(err);
  });
}

async function notifySubscribers(message) {
  // Statically configured subscribers
  if (message.type === "trophy_collected") {
    await userAccounts.onReceiveTrophyCollectedMessage(message);
  } else if (message.type === "user_score_updated") {
    await leaderboard.onReceiveUserScoreUpdatedMessage(message);
  }
}
