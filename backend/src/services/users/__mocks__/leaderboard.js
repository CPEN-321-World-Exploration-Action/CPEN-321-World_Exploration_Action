import { jest } from "@jest/globals";

export const leaderboard = () => ({
  onReceiveUserScoreUpdatedMessage: async (message) => {
    console.log(`onReceiveUserScoreUpdatedMessage mock called with ${message}`);
  },
  getGlobalLeaderboard: async () => {
    console.log(`getGlobalLeaderboard mock called`);
  },
  getFriendLeaderboard: async (userId) => {
    console.log(`getGlobalLeaderboard mock called with userId=${userId}`);
  },
  subscribeUpdate: async (userId, fcmToken) => {
    console.log(
      `subscribeUpdate mock called with userId=${userId} fcmToken=${fcmToken}`
    );
  },
});

export default leaderboard;
