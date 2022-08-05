import request from "supertest";
import { app } from "../../src/app.js";
import {
  connectToDatabase,
  dropAndDisconnectDatabase,
} from "../../src/utils/database.js";
import { TrophyTrophy, TrophyUser } from "../../src/data/db/trophy.db.js";
import { Photo } from "../../src/data/db/photo.db.js";
import { User } from "../../src/data/db/user.db.js";

const testDbUri = "mongodb://localhost:27017/review_trophy_details";

const agent = request.agent(app);

beforeAll(async () => {
  await connectToDatabase(testDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await User.deleteMany({});
  await TrophyTrophy.deleteMany({});
  await TrophyUser.deleteMany({});
  await Photo.deleteMany({});

  // create an logged in user
  await agent.post("/users/accounts/tester-login").expect(201);

  // initialize relevant databases
  await initialize_trophy_database();
});

async function initialize_trophy_database() {
  await TrophyTrophy.create({
    trophy_id: "ChIJrf8w27NyhlQR44St4PQccfY",
    name: "Museum of Anthropology at UBC",
    latitude: 49.274090892070916,
    longitude: -123.25346028876827,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: ["picture_1", "picture_2"],
    list_of_collectors: ["_test_user_1"],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJNz7rZoVvhlQR9kZL6IxEY00",
    name: "Grouse Mountain",
    latitude: 49.37331379533432,
    longitude: -123.0979279502943,
    number_of_collectors: 2,
    quality: "Bronze",
    list_of_photos: [],
    list_of_collectors: ["User_1", "User_4"],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE",

    name: "Science World",
    latitude: 49.27709458817354,
    longitude: -123.10307779131516,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJFVAVj8dyhlQRZ0mEdRRpDfc",

    name: "Jim Everett Memorial Park",
    latitude: 49.26769505126078,
    longitude: -123.24102515871157,
    number_of_collectors: 0,
    quality: "Bronze",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJrf8w27NyhlQR44St4PQccfY2",

    name: "Museum of Anthropology at UBC2",
    latitude: 49.274090892070916,
    longitude: -123.25346028876827,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: [],
    list_of_collectors: ["User_4"],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJM0zlFrZyhlQRWuLgl4eRO4s",

    name: "Networks of Centres of Excellence Campus Security",
    latitude: 49.26432,
    longitude: -123.251574,
    number_of_collectors: 2,
    quality: "Bronze",
    list_of_photos: [],
    list_of_collectors: ["User_1", "User_4"],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE2",

    name: "Science World2",
    latitude: 49.27709458817354,
    longitude: -123.10307779131516,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE3",

    name: "Science World2",
    latitude: 49.27709458817354,
    longitude: -123.10307779131516,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE4",

    name: "Science World2",
    latitude: 49.27709458817354,
    longitude: -123.10307779131516,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE5",

    name: "Science World2",
    latitude: 49.27709458817354,
    longitude: -123.10307779131516,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJnZHwi2NxhlQRN3CYHzc3giE6",

    name: "Science World2",
    latitude: 49.27709458817354,
    longitude: -123.10307779131516,
    number_of_collectors: 0,
    quality: "Gold",
    list_of_photos: [" "],
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
    list_of_collectors: ["User_2"],
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
    list_of_collectors: ["User_2"],
  });

  await TrophyTrophy.create({
    trophy_id: "ChIJ28IkUs5zhlQRua6hLV7S3jY2",

    name: "Granville_Island2",
    latitude: 49.2712,
    longitude: -123.134,
    number_of_collectors: 1,
    quality: "Gold",
    list_of_photos: [" "],
    list_of_collectors: ["User_2"],
  });

  const testUser1 = {
    user_id: "_test_user_1",
    name: "Test User 1",
    email: "testuser1@wea.com",
    picture: "https://avatars.githubusercontent.com/u/20661066",
    friends: ["_test_user_2", "_test_user_3", "_test_user_4", "_test_user_5"],
    score: 99,
    // fcm_token may be expired
    fcm_token:
      "dzKHRzYxSt2fJUIYyIfLcO:APA91bGvV3cNi5_2s4bodqrxMBLax-93NvL_xhJhNg2Z7r7VknRxHrj76eo-DsLXXRwFfUPGFGVlyxtx0-F5epJ9DiCMbeXpPnqrgeybfI1Gcu3vvMLs_VjOP0HTgAl_J-kGEwYUllgw",
  };
  const testUser2 = {
    user_id: "_test_user_2",
    name: "Test User 2",
    email: "testuser2@wea.com",
    friends: ["_test_user_1"],
    score: 156,
    fcm_token: null,
  };
  const testUser3 = {
    user_id: "_test_user_3",
    name: "Test User 3",
    email: "testuser3@wea.com",
    picture: "https://avatars.githubusercontent.com/u/4498198",
    friends: ["_test_user_1"],
    score: 321,
    fcm_token: null,
  };
  await User.upsertUser(testUser1);
  await User.upsertUser(testUser2);
  await User.upsertUser(testUser3);
  await TrophyUser.create({
    user_id: "_test_user_1",

    uncollectedTrophies: [" "], // to be determined
    collectedTrophies: [" ", "ChIJrf8w27NyhlQR44St4PQccfY"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });
  await TrophyUser.updateOne({
    user_id: "_test_user_2",
    uncollectedTrophies: [" "], // to be determined
    collectedTrophies: [" ", "Trophy_Wreck_Beach"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });
  await TrophyUser.updateOne({
    user_id: "_test_user_3",
    uncollectedTrophies: [" "], // to be determined
    collectedTrophies: [" ", "Trophy_Wreck_Beach"],
    list_of_photos: [" "], // no matter in this case
    trophyTags: [" "], // no matter in this case
  });

  await Photo.create({
    photo_id: "picture_1",
    like: 10,
    user_id: "_test_user_1",
    trophy_id: "ChIJrf8w27NyhlQR44St4PQccfY",
    time: new Date().getTime(),
  });

  await Photo.create({
    photo_id: "picture_2",
    like: 1,
    user_id: "_test_user_2",
    trophy_id: "ChIJrf8w27NyhlQR44St4PQccfY",
    time: new Date().getTime(),
  });
}

describe("View Trophy Details", () => {
  test("Get Details of an existing Trophy with a TrophyID", async () => {
    const res = await agent.get("/trophies/ChIJrf8w27NyhlQR44St4PQccfY");

    expect(res.status).toStrictEqual(200);
    expect(res.body.list_of_collectors).toContain("_test_user_1");
  });

  test("Get Details of a non-existing Trophy", async () => {
    const res = await agent.get("/trophies/ChIJrf8w27NyhlQR44St4PQccfYaa23");

    expect(res.status).toStrictEqual(404);
  });
});

describe("Get Trophy Photos", () => {
  test("Get Photos Associated with a valid Trophy", async () => {
    const res = await agent.get(
      "/photos/sorting/photo-ids?trophyId=ChIJrf8w27NyhlQR44St4PQccfY"
    );

    expect(res.status).toStrictEqual(200);
    expect(res.body.map((x) => x.photo_id)).toContain("picture_1");
    expect(res.body.map((x) => x.photo_id)).toContain("picture_2");
  });

  test("Get Photos Associated with an invalid Trophy", async () => {
    const res = await agent.get(
      "/photos/sorting/photo-ids?trophyId=ChIJrf8w27NyhlQR44St4PQccfY123123"
    );

    expect(res.status).toStrictEqual(404);
  });

  test("Get Photos for a valid Trophy without any photos", async () => {
    const res = await agent.get(
      "/photos/sorting/photo-ids?trophyId=ChIJnZHwi2NxhlQRN3CYHzc3giE6"
    );
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual([]);
  });

  test("Get Photos for a valid Trophy ordered by time", async () => {
    const res = await agent.get(
      "/photos/sorting/photo-ids?trophyId=ChIJrf8w27NyhlQR44St4PQccfY&order=time"
    );
    expect(res.status).toStrictEqual(200);
    expect(res.body.map((x) => x.photo_id)).toStrictEqual([
      "picture_2",
      "picture_1",
    ]);
  });

  test("Get Photos for valid Trophy ordered by likes", async () => {
    const res = await agent.get(
      "/photos/sorting/photo-ids?trophyId=ChIJrf8w27NyhlQR44St4PQccfY&order=like"
    );
    expect(res.status).toStrictEqual(200);
    expect(res.body.map((x) => x.photo_id)).toStrictEqual([
      "picture_1",
      "picture_2",
    ]);
  });

  test("Get Photos for valid Trophy, explicitly ordered randomly", async () => {
    const res = await agent.get(
      "/photos/sorting/photo-ids?trophyId=ChIJrf8w27NyhlQR44St4PQccfY&order=random"
    );

    expect(res.status).toStrictEqual(200);
    expect(res.body.map((x) => x.photo_id)).toContain("picture_1");
    expect(res.body.map((x) => x.photo_id)).toContain("picture_2");
  });

  test("Get Photos for valid Trophy with an invalid ordering (not time, likes, or random)", async () => {
    const res = await agent.get(
      "/photos/sorting/photo-ids?trophyId=ChIJrf8w27NyhlQR44St4PQccfY&order=invalid"
    );

    expect(res.status).toStrictEqual(400);
  });
});
