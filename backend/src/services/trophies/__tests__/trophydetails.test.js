import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { BadRequestError, NotFoundError, InputError, NotInDBError } from "../../../utils/errors.js";

import * as trophyDetail from "../trophydetails.js";
import { TrophyUser, TrophyTrophy } from "../../../data/db/trophy.db.js";
import * as Places from "../../../data/external/googleplaces.external.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../../utils/database.js";

jest.mock("../../../data/external/googleplaces.external.js");

// database connection
const defaultDbUri = "mongodb://localhost:27017/trophydetails_test";

async function initialize_trophy_database() {
  await trophyDetail.resetTrophyUserForTester();
  await TrophyTrophy.deleteMany({});

  await TrophyTrophy.create({
    trophy_id: "ChIJrf8w27NyhlQR44St4PQccfY",
    name: "Museum of Anthropology at UBC",
    latitude: 49.2740,
    longitude: -123.2534,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: [],
    list_of_collectors: ["User_1"]
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJNz7rZoVvhlQR9kZL6IxEY00",
    name: "Grouse Mountain",
    latitude: 49.3733,
    longitude: -123.0979,
    number_of_collectors: 2,
    quality: "Bronze",
    list_of_photos: [],
    list_of_collectors: ["User_1", "User_4"]
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE",
    name: "Science World",
    latitude: 49.277,
    longitude: -123.103,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
    name: "Jim Everett Memorial Park",
    latitude: 49.267,
    longitude: -123.241,
    number_of_collectors: 0,
    quality: "Bronze",
    list_of_photos: [],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJrf8w27NyhlQR44St4PQccfY2",
    name: "Museum of Anthropology at UBC2",
    latitude: 49.274,
    longitude: -123.253,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: [],
    list_of_collectors: ["User_4"]
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
    name: "Networks of Centres of Excellence Campus Security",
    latitude: 49.2643,
    longitude: -123.2515,
    number_of_collectors: 2,
    quality: "Bronze",
    list_of_photos: [],
    list_of_collectors: ["User_1", "User_4"]
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE2",
    name: "Science World2",
    latitude: 49.277,
    longitude: -123.103,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE3",
    name: "Science World2",
    latitude: 49.277,
    longitude: -123.103,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE4",
    name: "Science World2",
    latitude: 49.2772,
    longitude: -123.1033,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE5",
    name: "Science World2",
    latitude: 49.2771,
    longitude: -123.1031,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE6",
    name: "Science World2",
    latitude: 49.2771,
    longitude: -123.1031,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJcfSTmvR0hlQRHTBUcvS9EmE2",
    name: "Rose_Garden2",
    latitude: 49.2694,
    longitude: -123.2565,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
    ],
    list_of_collectors: ["User_2"]
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJUzqZj0oNhlQRSzlBeYd5v-02",
    name: "Wreck_Beach2",
    latitude: 49.2622,
    longitude: -123.2615,
    number_of_collectors: 1,
    quality: "Bronze",
    list_of_photos: [
      "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSgwbtyZJOXnromXn-b-mFTlCTjm6iFKq0424DBguh_CYFYuqyY6Paeez94zfJv8FO8",
      "https://media-cdn.tripadvisor.com/media/photo-m/1280/19/1e/7d/b3/photo0jpg.jpg",
    ],
    list_of_collectors: ["User_2"]
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJ28IkUs5zhlQRua6hLV7S3jY2",
    name: "Granville_Island2",
    latitude: 49.2712,
    longitude: -123.134,
    number_of_collectors: 1,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: ["User_2"],
  });
}

async function initialize_user_database() {
  await TrophyUser.deleteMany({});

  await TrophyUser.create({
    user_id: "User_0",
    uncollectedTrophies: [" ", "Trophy_Rose_Garasdden", "Trophy_asdGranville_Island"], // not in DB
    collectedTrophies: [" ", "Trophy_Wrasdeck_Beach"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });

  await TrophyUser.create({
    user_id: "User_1",
    uncollectedTrophies: [" ", "Trophy_Rose_Garden", "Trophy_Granville_Island"], // to be determined
    collectedTrophies: [" ", "Trophy_Wreck_Beach"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });

  await TrophyUser.create({
    user_id: "User_2",
    uncollectedTrophies: [" ", "ChIJrf8w27NyhlQR44St4PQccfY", "ChIJNz7rZoVvhlQR9kZL6IxEY00",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE", "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
      "ChIJrf8w27NyhlQR44St4PQccfY2", "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2"], // to be determined
    collectedTrophies: [" ", "ChIJcfSTmvR0hlQRHTBUcvS9EmE2", "ChIJUzqZj0oNhlQRSzlBeYd5v-02", "ChIJ28IkUs5zhlQRua6hLV7S3jY2"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });

  await TrophyUser.create({
    user_id: "UserAllCollected",
    uncollectedTrophies: [" "], // to be determined
    collectedTrophies: [" ", "ChIJcfSTmvR0hlQRHTBUcvS9EmE2", "ChIJUzqZj0oNhlQRSzlBeYd5v-02", "ChIJ28IkUs5zhlQRua6hLV7S3jY2"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });

  await TrophyUser.create({
    user_id: "User_5",
    uncollectedTrophies: [" ", "ChIJrf8w27NyhlQR44St4PQccfY", "ChIJNz7rZoVvhlQR9kZL6IxEY00",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE", "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
      "ChIJrf8w27NyhlQR44St4PQccfY2", "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2", "ChIJnZHwi2NxhlQRN3CYHzc3giE3", "ChIJnZHwi2NxhlQRN3CYHzc3giE4",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE5", "ChIJnZHwi2NxhlQRN3CYHzc3giE6"], // to be determined
    collectedTrophies: [" ", "ChIJcfSTmvR0hlQRHTBUcvS9EmE2", "ChIJUzqZj0oNhlQRSzlBeYd5v-02", "ChIJ28IkUs5zhlQRua6hLV7S3jY2"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });

  await TrophyUser.create({
    user_id: "User_3",
    uncollectedTrophies: [" ", "ChIJrf8w27NyhlQR44St4PQccfY", "ChIJNz7rZoVvhlQR9kZL6IxEY00",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE", "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
      "ChIJrf8w27NyhlQR44St4PQccfY2", "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2"], // to be determined
    collectedTrophies: [" "],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });

  await TrophyUser.create({
    user_id: "User_G",
    uncollectedTrophies: [" "], // to be determined
    collectedTrophies: [" ", "Trophy_Wreck_Beach"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });
}

async function trophyUpdateOrCreate(trophy_id) {
  let Trophy_Test = await TrophyTrophy.findOne({
    trophy_id: trophy_id,
  }).exec();
  if (!Trophy_Test) {
    await TrophyTrophy.create({ trophy_id: trophy_id, latitude: 0, longitude: 0 });
  }
}

beforeAll(async () => {
  await connectToDatabase(defaultDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await initialize_trophy_database();
  await initialize_user_database();
});

afterEach(async () => {
  await TrophyTrophy.deleteMany({});
  await TrophyUser.deleteMany({});
});

describe("Trophy_Detail Module getTrophiesUser Test", () => {
  /* Trophy[] getTrophiesUser(String userId, double lat, double lon) */

  test("getTrophiesUser", async () => {
    // Trophies in mini distance -> uncollectedTrophyIDs is reserved
    // the number of userId’s
    // uncollected trophies is less
    // than MAX_TROPHIES -> uncollected reach MAX_TROPHIES
    let lat = 49.264; // chosen value of location, around Networks of Centres of Excellence Campus Security
    let lon = -123.251;
    let userId = "User_3";

    const trophyList = await trophyDetail.getTrophiesUser(userId, lat, lon);

    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJrf8w27NyhlQR44St4PQccfY"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJNz7rZoVvhlQR9kZL6IxEY00"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJnZHwi2NxhlQRN3CYHzc3giE"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJFVAVj8dyhlQRZ0mEdRRpDfc"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJrf8w27NyhlQR44St4PQccfY2"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJM0zlFrZyhlQRWuLgl4eRO4s"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJcfSTmvR0hlQRHTBUcvS9EmE"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0"
    );
    expect(trophyList.map(x => x.trophy_id)).toContain(
      "ChIJ28IkUs5zhlQRua6hLV7S3jY"
    );

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies
    ).toEqual(expect.arrayContaining(["ChIJrf8w27NyhlQR44St4PQccfY", "ChIJNz7rZoVvhlQR9kZL6IxEY00",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE", "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
      "ChIJrf8w27NyhlQR44St4PQccfY2", "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2", "ChIJcfSTmvR0hlQRHTBUcvS9EmE",
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0", "ChIJ28IkUs5zhlQRua6hLV7S3jY"]));
    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies.length
    ).toEqual(trophyDetail.MAX_TROPHIES);
  });

  test("getTrophiesUser_user_has_collected", async () => {
    // the number of userId’s
    // uncollected trophies is less
    // than MAX_TROPHIES
    let lat = 49.264; // chosen value of location, around Networks of Centres of Excellence Campus Security
    let lon = -123.251;
    let userId = "User_2";

    const trophyList = await trophyDetail.getTrophiesUser(userId, lat, lon);
    const userCollected = (await TrophyUser.findOne({
      user_id: userId,
    }).exec()).collectedTrophies;

    expect(
      trophyList.map(x => x.trophy_id)
    ).toEqual(expect.arrayContaining(["ChIJrf8w27NyhlQR44St4PQccfY", "ChIJNz7rZoVvhlQR9kZL6IxEY00",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE", "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
      "ChIJrf8w27NyhlQR44St4PQccfY2", "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2", "ChIJcfSTmvR0hlQRHTBUcvS9EmE",
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0", "ChIJ28IkUs5zhlQRua6hLV7S3jY"]));

    expect(
      trophyList.map(x => x.trophy_id)
    ).toEqual(expect.arrayContaining(userCollected.filter(function (x) {
      return x != " ";
    })));

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies
    ).toEqual(expect.arrayContaining(["ChIJrf8w27NyhlQR44St4PQccfY", "ChIJNz7rZoVvhlQR9kZL6IxEY00",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE", "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
      "ChIJrf8w27NyhlQR44St4PQccfY2", "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2", "ChIJcfSTmvR0hlQRHTBUcvS9EmE",
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0", "ChIJ28IkUs5zhlQRua6hLV7S3jY"]));

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies.length
    ).toEqual(trophyDetail.MAX_TROPHIES);
  });

  test("getTrophiesUser_user_no_uncollected_trophy_near", async () => {
    let lat = 250; // chosen value of location, around Networks of Centres of Excellence Campus Security
    let lon = 249;
    let userId = "User_2";

    const userunCollected = (await TrophyUser.findOne({
      user_id: userId,
    }).exec()).uncollectedTrophies;
    const trophyList = await trophyDetail.getTrophiesUser(userId, lat, lon);

    expect(
      trophyList.map(x => x.trophy_id)
    ).not.toEqual(expect.arrayContaining(["ChIJrf8w27NyhlQR44St4PQccfY", "ChIJNz7rZoVvhlQR9kZL6IxEY00",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE", "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",
      "ChIJrf8w27NyhlQR44St4PQccfY2", "ChIJM0zlFrZyhlQRWuLgl4eRO4s",
      "ChIJnZHwi2NxhlQRN3CYHzc3giE2"]));

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies
    ).toEqual(expect.arrayContaining(["ChIJcfSTmvR0hlQRHTBUcvS9EmE",
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0", "ChIJ28IkUs5zhlQRua6hLV7S3jY"]));

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies.length).toEqual(userunCollected.length + 3);
  });

  test("getTrophiesUser_user_too_many", async () => {
    let lat = 49.264; // chosen value of location, around Networks of Centres of Excellence Campus Security
    let lon = -123.251;
    let userId = "User_5";

    const userunCollected = (await TrophyUser.findOne({
      user_id: userId,
    }).exec()).uncollectedTrophies;
    const userCollected = (await TrophyUser.findOne({
      user_id: userId,
    }).exec()).collectedTrophies;

    const trophyList = await trophyDetail.getTrophiesUser(userId, lat, lon);

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies
    ).toEqual(expect.arrayContaining(userunCollected));

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies
    ).not.toEqual(expect.arrayContaining(["ChIJcfSTmvR0hlQRHTBUcvS9EmE",
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0", "ChIJ28IkUs5zhlQRua6hLV7S3jY"]));

    expect(
      trophyList.map(x => x.trophy_id)
    ).toEqual(expect.arrayContaining((userunCollected.concat(userCollected)).filter(function (x) {
      return x != " ";
    })));
  });

  test("getTrophiesUser_no_trophies", async () => {
    let lat = 250;
    let lon = 252;
    let userId = "User_G";
    expect(await trophyDetail.getTrophiesUser(userId, lat, lon)).toStrictEqual([]);
  });

  test("getTrophiesUser_null_lat_lon", async () => {
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(async () => await trophyDetail.getTrophiesUser(userId, null, lon)).rejects.toThrow(InputError);
    expect(async () => await trophyDetail.getTrophiesUser(userId, lat, null)).rejects.toThrow(InputError);
    expect(async () => await trophyDetail.getTrophiesUser(userId, undefined, null)).rejects.toThrow(InputError);
  });

  test("getTrophiesUser_invalid_userId", async () => {
    let lat = 123;
    let lon = 123;
    let userId = null;
    expect(async () => await trophyDetail.getTrophiesUser(userId, lat, lon)).rejects.toThrow(InputError);
  });

  test("getTrophiesUser_userId_has_no_uncollected", async () => {
    let lat = 49.264; // chosen value of location, around Networks of Centres of Excellence Campus Security
    let lon = -123.251;
    let userId = "UserAllCollected";
    const trophyList = await trophyDetail.getTrophiesUser(userId, lat, lon);

    expect(
      trophyList.map(x => x.trophy_id)
    ).toEqual(expect.arrayContaining(["ChIJcfSTmvR0hlQRHTBUcvS9EmE",
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0", "ChIJ28IkUs5zhlQRua6hLV7S3jY",
      "ChIJcfSTmvR0hlQRHTBUcvS9EmE2", "ChIJUzqZj0oNhlQRSzlBeYd5v-02", "ChIJ28IkUs5zhlQRua6hLV7S3jY2"]));

    expect(
      (await TrophyUser.findOne({
        user_id: userId,
      }).exec()).uncollectedTrophies
    ).toEqual(expect.arrayContaining(["ChIJcfSTmvR0hlQRHTBUcvS9EmE",
      "ChIJUzqZj0oNhlQRSzlBeYd5v-0", "ChIJ28IkUs5zhlQRua6hLV7S3jY"]));
  });
});

describe("Trophy_Detail Module getTrophyDetails Test", () => {
  test("getTrophyDetails", async () => {
    let trophyId = "ChIJcfSTmvR0hlQRHTBUcvS9EmE2";

    let trophyDetails = await trophyDetail.getTrophyDetails(trophyId);

    expect(trophyDetails[0]).toHaveProperty(
      "trophy_id", "ChIJcfSTmvR0hlQRHTBUcvS9EmE2");
    expect(trophyDetails[0]).toHaveProperty(
      "name", "Rose_Garden2");
    expect(trophyDetails[0]).toHaveProperty(
      "latitude", 49.2694);
    expect(trophyDetails[0]).toHaveProperty(
      "longitude", -123.2565);
    expect(trophyDetails[0]).toHaveProperty(
      "number_of_collectors", 1);
    expect(trophyDetails[0]).toHaveProperty(
      "quality", "Silver");
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_photos", [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
    ]);
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_collectors", ["User_2"]);
  });

  test("getTrophyDetailsMultiple", async () => {
    let trophyId = ["ChIJcfSTmvR0hlQRHTBUcvS9EmE2", "ChIJ28IkUs5zhlQRua6hLV7S3jY2"];
    let trophyDetails = await trophyDetail.getTrophyDetails(trophyId);

    console.log(trophyDetails);

    expect(trophyDetails[1]).toHaveProperty(
      "trophy_id", "ChIJcfSTmvR0hlQRHTBUcvS9EmE2");
    expect(trophyDetails[1]).toHaveProperty(
      "name", "Rose_Garden2");
    expect(trophyDetails[1]).toHaveProperty(
      "latitude", 49.2694);
    expect(trophyDetails[1]).toHaveProperty(
      "longitude", -123.2565);
    expect(trophyDetails[1]).toHaveProperty(
      "number_of_collectors", 1);
    expect(trophyDetails[1]).toHaveProperty(
      "quality", "Silver");
    expect(trophyDetails[1]).toHaveProperty(
      "list_of_photos", [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
    ]);
    expect(trophyDetails[1]).toHaveProperty(
      "list_of_collectors", ["User_2"]);

    expect(trophyDetails[0]).toHaveProperty(
      "trophy_id", "ChIJ28IkUs5zhlQRua6hLV7S3jY2");
    expect(trophyDetails[0]).toHaveProperty(
      "name", "Granville_Island2");
    expect(trophyDetails[0]).toHaveProperty(
      "latitude", 49.2712);
    expect(trophyDetails[0]).toHaveProperty(
      "longitude", -123.134);
    expect(trophyDetails[0]).toHaveProperty(
      "number_of_collectors", 1);
    expect(trophyDetails[0]).toHaveProperty(
      "quality", "Gold");
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_photos", []);
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_collectors", ["User_2"]);
  });

  test("getTrophyDetails_invalid_TrophyID", async () => {
    expect(async () => await trophyDetail.getTrophyDetails(null)).rejects.toThrow(InputError);
    expect(async () => await trophyDetail.getTrophyDetails(undefined)).rejects.toThrow(InputError);
    expect(async () => await trophyDetail.getTrophyDetails(NaN)).rejects.toThrow(InputError);
  });

  test("getTrophyDetails", async () => {
    let trophyId = "TrophyNotInDB";
    expect(await trophyDetail.getTrophyDetails(trophyId)).toEqual([]);
  });
});
