import { jest } from "@jest/globals";

export const userLikePhoto = jest.fn(async (userID, picID) => {});

export const uploadPhoto = jest.fn(async (userId, trophyId, photoId) => {});

export const getPhotoIDsByUserID = jest.fn(async (userId) => {
  return mockPhotos;
});

export const getPhotoIDsByTrophyID = jest.fn(
  async (trophyID, order, userId) => {
    return mockPhotos;
  }
);

export const mockPhotos = [
  {
    photo_id: "_test_photo_id_1",
    like: 2,
    user_id: "_test_user_1",
    trophy_id: "_test_trophy_id_1",
    time: new Date("2022-07-16T13:23:31"),
    likedUsers: ["_test_user_1", "_test_user_2"],
  },
  {
    photo_id: "_test_photo_id_2",
    like: 2,
    user_id: "_test_user_2",
    trophy_id: "_test_trophy_id_1",
    time: new Date("2022-07-27T18:26:33"),
    likedUsers: ["_test_user_1", "_test_user_3", "_test_user_4"],
  },
];
