import { jest } from "@jest/globals";

export const getTrophiesUser = jest.fn(
  async (user_id, user_latitude, user_longitude) => {return MockTrophyList}
);

export const getTrophyDetails = jest.fn(async (ids) => {});

export const resetTrophyUserForTester = jest.fn(async (userId) => {});

export const MockTrophyList = [
  {
    trophy_id: "Trophy_1",
    name: "Trophy1",
    latitude: 123,
    longitude: 123,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: ["Photo_1_1"],
    list_of_collectors: ["User_2"]
  },
  {
    trophy_id: "Trophy_2",
    name: "Trophy2",
    latitude: 256,
    longitude: 256,
    number_of_collectors: 3,
    quality: "Bronze",
    list_of_photos: ["Photo_2_1", "Photo_2_2"],
    list_of_collectors: ["User_1", "User_2", "User_3"]
  },
  {
    trophy_id: "Trophy_3",
    name: "Trophy3",
    latitude: 2562,
    longitude: 2562,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: [" "]
  }
];