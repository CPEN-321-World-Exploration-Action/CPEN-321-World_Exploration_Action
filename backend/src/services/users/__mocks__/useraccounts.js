import { jest } from "@jest/globals";

export const onReceiveTrophyCollectedMessage = jest.fn(async (message) => {});

export const getUserProfile = jest.fn(async (userId) => {
  return mockUser;
});

export const uploadFcmToken = jest.fn(async (userId, fcmToken) => {});

export const loginWithGoogle = jest.fn(async (idToken) => {
  return mockUser;
});

export const searchUser = jest.fn(async (query) => {
  return mockUsers;
});

export const signOut = jest.fn(async () => {});

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
