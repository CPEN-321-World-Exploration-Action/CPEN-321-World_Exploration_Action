import { jest } from "@jest/globals";

export const getTrophiesUser = jest.fn(
  async (user_id, user_latitude, user_longitude) => {
    return MockTrophyList;
  }
);

export const getTrophyDetails = jest.fn(async (ids) => {
  return MockTrophy;
});

// i think not going to be used

export const resetTrophyUserForTester = jest.fn(async (userId) => { });

export const MockTrophy = [
  {
    trophy_id: "Trophy_Rose_Garden",
    name: "Rose_Garden",
    latitude: 49.2694,
    longitude: -123.2565,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
    ],
    list_of_collectors: ["User_2"],
  },
];

export const MockTrophyList = [
  {
    trophy_id: "Trophy_Rose_Garden",
    name: "Rose_Garden",
    latitude: 49.2694,
    longitude: -123.2565,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
    ],
    list_of_collectors: ["User_2"],
  },
  {
    trophy_id: "Trophy_Wreck_Beach",
    name: "Wreck_Beach",
    latitude: 49.2622,
    longitude: -123.2615,
    number_of_collectors: 3,
    quality: "Bronze",
    list_of_photos: [
      "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSgwbtyZJOXnromXn-b-mFTlCTjm6iFKq0424DBguh_CYFYuqyY6Paeez94zfJv8FO8",
      "https://media-cdn.tripadvisor.com/media/photo-m/1280/19/1e/7d/b3/photo0jpg.jpg",
    ],
    list_of_collectors: ["User_1", "User_2", "User_3"],
  },
  {
    trophy_id: "Trophy_Granville_Island",
    name: "Granville_Island",
    latitude: 49.2712,
    longitude: -123.134,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  },
];

// helper functions
