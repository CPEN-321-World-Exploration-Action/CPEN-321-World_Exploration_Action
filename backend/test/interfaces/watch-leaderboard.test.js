import request from "supertest";
import { app } from "../../src/app.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../src/utils/database.js";
import { User } from "../../src/data/db/user.db.js";

const testDbUri = "mongodb://localhost:27017/test_watch_leaderboard";

const agent = request.agent(app);

beforeAll(async () => {
  await connectToDatabase(testDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await User.deleteMany({});

  // create an logged in user
  await agent.post("/users/accounts/tester-login").expect(201);

  // initialize relevant databases
  await createTestUsers();
});

async function createTestUsers() {
  const testUser1 = {
    user_id: "_test_user_1",
    name: "Test User 1",
    email: "testuser1@wea.com",
    picture: "https://avatars.githubusercontent.com/u/20661066",
    friends: ["_test_user_2", "_test_user_3", "_test_user_4", "_test_user_5"],
    score: 99,
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
  const testUser4 = {
    user_id: "_test_user_4",
    name: "Test User 4",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: ["_test_user_1"],
    score: 158,
    fcm_token: null,
  };
  const testUser5 = {
    user_id: "_test_user_5",
    name: "Test User 5",
    email: "testuser4@wea.com",
    friends: ["_test_user_1"],
    score: 98,
    fcm_token: null,
  };
  const testUser6 = {
    user_id: "_test_user_6",
    name: "Test User 6",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 97,
    fcm_token: null,
  };
  const testUser7 = {
    user_id: "_test_user_7",
    name: "Test User 7",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 96,
    fcm_token: null,
  };
  const testUser8 = {
    user_id: "_test_user_8",
    name: "Test User 8",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 95,
    fcm_token: null,
  };
  const testUser9 = {
    user_id: "_test_user_9",
    name: "Test User 9",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 94,
    fcm_token: null,
  };
  const testUser10 = {
    user_id: "_test_user_10",
    name: "Test User 10",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 93,
    fcm_token: null,
  };
  const testUser11 = {
    user_id: "_test_user_11",
    name: "Test User 11",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 92,
    fcm_token: null,
  };
  await User.upsertUser(testUser1);
  await User.upsertUser(testUser2);
  await User.upsertUser(testUser3);
  await User.upsertUser(testUser4);
  await User.upsertUser(testUser5);
  await User.upsertUser(testUser6);
  await User.upsertUser(testUser7);
  await User.upsertUser(testUser8);
  await User.upsertUser(testUser9);
  await User.upsertUser(testUser10);
  await User.upsertUser(testUser11);
}

describe("See Global Leaderboard", () => {
  test("Valid, Authenticated User requests global leaderboard", async () => {
    const res = await agent.get("/users/leaderboard/global");

    expect(res.status).toStrictEqual(200);
    expect(res.body.length).toStrictEqual(10);
    expect(res.body[0]).toHaveProperty("user_id", "_test_user_3");
    expect(res.body[1]).toHaveProperty("user_id", "_test_user_4");
    expect(res.body[2]).toHaveProperty("user_id", "_test_user_2");
    expect(res.body[3]).toHaveProperty("user_id", "_test_user_1");
    expect(res.body[4]).toHaveProperty("user_id", "_test_user_5");
    expect(res.body[5]).toHaveProperty("user_id", "_test_user_6");
    expect(res.body[6]).toHaveProperty("user_id", "_test_user_7");
    expect(res.body[7]).toHaveProperty("user_id", "_test_user_8");
    expect(res.body[8]).toHaveProperty("user_id", "_test_user_9");
    expect(res.body[9]).toHaveProperty("user_id", "_test_user_10");
  });

  test("Valid, non-authenticated User requests Global Leaderboard", async () => {
    const res = await request.agent(app).get("/users/leaderboard/global");
    expect(res.status).toStrictEqual(401);
  });

  test("Valid, authenticated User requests empty global leaderboard", async () => {
    await User.deleteMany({});
    const res = await agent.get("/users/leaderboard/global");
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual([]);
  });
});

describe("See Friends Leaderboard", () => {
  test("Valid, Authenticated User requests friends leaderboard", async () => {
    const res = await agent.get("/users/leaderboard/friend");

    expect(res.status).toStrictEqual(200);
    expect(res.body.length).toBeLessThanOrEqual(10);
    expect(res.body[0]).toHaveProperty("user_id", "_test_user_3");
    expect(res.body[1]).toHaveProperty("user_id", "_test_user_4");
    expect(res.body[2]).toHaveProperty("user_id", "_test_user_2");
    expect(res.body[4]).toHaveProperty("user_id", "_test_user_5");
  });

  test("Valid, non-authenticated User requests Friends Leaderboard", async () => {
    const res = await request.agent(app).get("/users/leaderboard/friend");
    expect(res.status).toStrictEqual(401);
  });

  test("Valid, authenticated User with no Friends requests Friends leaderboard", async () => {
    await User.deleteMany();
    const testUser11 = {
      user_id: "_test_user_1",
      name: "Test User 1",
      email: "testuser4@wea.com",
      picture: "https://avatars.githubusercontent.com/u/65551651",
      friends: [],
      score: 92,
      fcm_token: null,
    };
    await User.upsertUser(testUser11);
    const res = await agent.get("/users/leaderboard/friend");
    expect(res.status).toStrictEqual(200);
    expect(res.body.length).toStrictEqual(1);
    expect(res.body[0]).toHaveProperty("user_id", "_test_user_1");
  });
});

describe("Subscribe to Leaderboard", () => {
  test("Valid, Authenticated User with FCM token subscribes to leaderboard updates", async () => {
    const res = await agent.put("/users/leaderboard/subscribe-update?fcmToken=_fcm_token");

    expect(res.status).toStrictEqual(200);
    expect(res.body).toHaveProperty("expireTime");
  });

  test("Valid, non-authenticated User requests Global Leaderboard", async () => {
    const res = await request
      .agent(app)
      .put("/users/leaderboard/subscribe-update");
    expect(res.status).toStrictEqual(401);
  });

  test("Valid, Authenticated User subscribes to leaderboard updates without providing a FCM token", async () => {
    await User.updateOne(
      { user_id: "_test_user_1" },
      { $set: { fcm_token: null } }
    );

    const res = await agent.put("/users/leaderboard/subscribe-update");

    expect(res.status).toStrictEqual(400);
  });
});
