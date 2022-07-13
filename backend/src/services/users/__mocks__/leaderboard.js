import { jest } from "@jest/globals";

export const mockGlobalLeaderboard = [
  {
    user_id: "572385753286",
    name: "Joseph Smith",
    email: "joseph.smith@gmail.com",
    picture:
      "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
    score: 890,
  },
  {
    user_id: "60894592438538",
    name: "Stefan Estes",
    email: "stefan.estes@gmail.com",
    picture:
      "https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg",
    score: 787,
  },
];

export const mockFriendLeaderboard = [
  {
    user_id: "572385753286",
    name: "Joseph Smith",
    email: "joseph.smith@gmail.com",
    picture:
      "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
    score: 890,
  }
];

export const mockExpireTime = 1657673071835;

export const leaderboard = () => ({
  onReceiveUserScoreUpdatedMessage: async (message) => {
    console.log(`onReceiveUserScoreUpdatedMessage mock called with ${message}`);
  },
  getGlobalLeaderboard: async () => {
    console.log(`getGlobalLeaderboard mock called`);
    return mockGlobalLeaderboard;
  },
  getFriendLeaderboard: async (userId) => {
    console.log(`getGlobalLeaderboard mock called with userId=${userId}`);
    return mockFriendLeaderboard;
  },
  subscribeUpdate: async (userId, fcmToken) => {
    console.log(`subscribeUpdate mock called with userId=${userId} fcmToken=${fcmToken}`);
    return mockExpireTime;
  },
});

export default leaderboard;
