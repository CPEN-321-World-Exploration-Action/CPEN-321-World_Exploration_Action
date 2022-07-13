import { jest } from "@jest/globals";

export const userAccountsMock = () => ({
  onReceiveTrophyCollectedMessage: async (message) => {
  },
  getUserProfile: async (userId) => {
    return mockUser;
  },
  uploadFcmToken: async (userId, fcmToken) => {
  },
  loginWithGoogle: async (idToken) => {
    return mockUser;
  },
  searchUser: async (query) => {
    return mockUsers;
  },
  signOut: async () => {
  },
});

export const mockUser = {
  user_id: "438952804820",
  name: "Joseph Smith",
  email: "joseph.smith@gmail.com",
  picture: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
  score: 890,
  rank: 8,
};

export const mockUsers = [
  {
    user_id: "438952804820",
    name: "Joseph Smith",
    email: "joseph.smith@gmail.com",
    picture:
      "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
    score: 890,
  },
  {
    user_id: "60894592438538",
    name: "Joseph Estes",
    email: "joseph.estes@gmail.com",
    picture:
      "https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg",
    score: 787,
  },
];

export default userAccountsMock;
