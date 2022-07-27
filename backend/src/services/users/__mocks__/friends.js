import { jest } from "@jest/globals";

export const retrieveFriends = jest.fn(async (userId) => {
  return mockUsers;
});

export const getFriendRequests = jest.fn(async (userId) => {
  return mockUsers;
});

export const sendRequest = jest.fn(async (senderId, targetId) => {});

export const deleteFriend = jest.fn(async (userId, friendId) => {});

export const acceptUser = jest.fn(async (userId, friendId) => {});

export const declineUser = jest.fn(async (userId, friendId) => {});

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
    name: "Stefan Estes",
    email: "stefan.estes@gmail.com",
    picture:
      "https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg",
    score: 787,
  },
];
