import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../src/utils/database.js";
import { TrophyTrophy, TrophyUser } from "../../src/data/db/trophy.db.js";
import { Photo } from "../../src/data/db/photo.db.js";

const testDbUri = "mongodb://localhost:27017/test_WEA_interface_collect_trophy";

const agent = request.agent(app);

beforeAll(async () => {
  await connectToDatabase(testDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await TrophyTrophy.deleteMany({});
  await TrophyUser.deleteMany({});
  await Photo.deleteMany({});

  await TrophyTrophy.create({
    trophy_id: "trophy_id_1",
    name: "UBC",
    latitude: 49.274,
    longitude: -123.253,
    number_of_collectors: 5,
    quality: "Gold",
    list_of_photos: [],
    list_of_collectors: []
  });

  await TrophyTrophy.create({
    trophy_id: "trophy_id_2",
    name: "Museum of Anthropology at UBC",
    latitude: 49.274,
    longitude: -123.253,
    number_of_collectors: 1,
    quality: "Silver",
    list_of_photos: [],
    list_of_collectors: []
  });

  await TrophyTrophy.create({
    trophy_id: "trophy_id_3",
    name: "Somewhere",
    latitude: 49.274,
    longitude: -123.253,
    number_of_collectors: 1,
    quality: "Bronze",
    list_of_photos: [],
    list_of_collectors: []
  });

  await TrophyUser.create({
    user_id: "_test_user_1",
    uncollectedTrophies: ["trophy_id_1", "trophy_id_2", "trophy_id_3"]
  });

  await agent
    .post("/users/accounts/tester-login")
    .expect(201);
});

describe("Collect Trophy: Collect Trophy", () => {
  test("Existing Trophy for Valid User ID", async () => {
    const scoreBefore = (await agent.get("/users/accounts/profiles/_test_user_1")).body.score;

    await agent.post("/trophies/_test_user_1/trophy_id_1").expect(200);
    await agent.post("/trophies/_test_user_1/trophy_id_2").expect(200);
    await agent.post("/trophies/_test_user_1/trophy_id_3").expect(200);
    await new Promise(r => setTimeout(r, 1000)); // Wait for promises to resolve
    const scoreAfter = (await agent.get("/users/accounts/profiles/_test_user_1")).body.score;

    expect(await TrophyUser.getUserUncollectedTrophyIDs("_test_user_1")).toStrictEqual([]);
    expect((await TrophyUser.getUserCollectedTrophyIDs("_test_user_1")).sort()).toStrictEqual(["trophy_id_1", "trophy_id_2", "trophy_id_3"]);
    expect(scoreAfter).toStrictEqual(scoreBefore + 16);
  });

  test("Non-Existing Trophy for Valid User ID", async () => {
    const scoreBefore = (await agent.get("/users/accounts/profiles/_test_user_1")).body.score;

    const res = await agent.post("/trophies/_test_user_1/ttttt");
    await new Promise(r => setTimeout(r, 500)); // Wait for promises to resolve
    const scoreAfter = (await agent.get("/users/accounts/profiles/_test_user_1")).body.score;

    expect(res.status).toStrictEqual(400);

    expect(await TrophyUser.getUserUncollectedTrophyIDs("_test_user_1")).toStrictEqual(["trophy_id_1", "trophy_id_2", "trophy_id_3"]);
    expect(await TrophyUser.getUserCollectedTrophyIDs("_test_user_1")).toStrictEqual([]);
    expect(scoreAfter).toStrictEqual(scoreBefore);
  });

  test("Existing Trophy for Invalid User ID", async () => {
    const res = await agent.post("/trophies/_test_user_99/trophy_id_1");
    expect(res.status).toStrictEqual(400);
  });

  test("Non-Existing Trophy for Invalid User ID", async () => {
    const res = await agent.post("/trophies/_test_user_99/123");
    expect(res.status).toStrictEqual(400);
  });

  test("Unauthorized User", async () => {
    const res = await request(app).post("/trophies/_test_user_1/trophy_id_1");
    expect(res.status).toStrictEqual(401);
  });
});

describe("Collect Trophy: Upload Photo", () => {
  test("Existing User and Existing Trophy", async () => {
    const res = await agent
      .post("/photos/storing/trophy_id_1/_test_user_1")
      .attach("photo", "test/res/test_photo.png");

    expect(res.status).toStrictEqual(201);
    expect((await Photo.getPhotosByUser("_test_user_1")).map(x => x.trophy_id)).toEqual(expect.arrayContaining(["trophy_id_1"]));
  });

  test("Unauthorized User", async () => {
    const res = await request(app)
      .post("/photos/storing/trophy_id_1/_test_user_1");
    expect(res.status).toStrictEqual(401);
  });

  test("No Photo", async () => {
    const res = await agent.post("/photos/storing/trophy_id_1/_test_user_1");
    expect(res.status).toStrictEqual(400);
  });

  test("Bad Photo", async () => {
    const res = await agent
      .post("/photos/storing/trophy_id_1/_test_user_1")
      .attach("photo", "test/res/bad_photo.txt");
    expect(res.status).toStrictEqual(400);
  });
});

test("User Creation", async() => {
  await TrophyUser.deleteMany({});
  expect(await TrophyUser.getUserUncollectedTrophyIDs("_test_user_1")).toStrictEqual([]);
});
