import request from "supertest";
import { app } from "../../src/app.js";
import {
  connectToDatabase,
  dropAndDisconnectDatabase,
} from "../../src/utils/database.js";
import { User } from "../../src/data/db/user.db.js";
import { Photo } from "../../src/data/db/photo.db.js";

const testDbUri = "mongodb://localhost:27017/test_view_profile";

const agent = request.agent(app);

beforeAll(async () => {
  await connectToDatabase(testDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Photo.deleteMany({});

  // create an logged in user
  await agent.post("/users/accounts/tester-login").expect(201);

  // initialize relevant databases
  await createTestUsers();
});

describe("Get User Profile", () => {
  test("Retrieve Profile for existing authenticated user", async () => {
    const res = await agent.get("/users/accounts/profiles/_test_user_1");

    expect(res.status).toStrictEqual(200);
    expect(res.body).toHaveProperty("user_id", "_test_user_1");
    expect(res.body).toHaveProperty("name", "Test User 1");
    expect(res.body).toHaveProperty("email", "testuser1@wea.com");
    expect(res.body).toHaveProperty(
      "picture",
      "https://avatars.githubusercontent.com/u/20661066"
    );
    expect(res.body).toHaveProperty("friends", ["_test_user_2"]);
    expect(res.body).toHaveProperty("score", 99);
    expect(res.body).toHaveProperty("rank", 4);
  });

  test("Retrieve Profile for existing but unauthenticated user", async () => {
    const res = await request
      .agent(app)
      .get("/users/accounts/profiles/_test_user_1");
    expect(res.status).toStrictEqual(401);
  });

  test("Retrieve Profile for non-existing user", async () => {
    const res = await agent.get("/users/accounts/profiles/_test_user_100");
    expect(res.status).toStrictEqual(404);
  });
});

describe("Get User Photos", () => {
  test("Retrieve Photos for Existing and Authenticated User who has taken photos", async () => {
    const res = await agent.get("/photos/sorting/user/_test_user_1");

    expect(res.status).toStrictEqual(200);
    expect(res.body[0]).toHaveProperty(
      "photo_id",
      "https://avatars.githubusercontent.com/u/20661066"
    );
    expect(res.body[0]).toHaveProperty("like", 0);
    expect(res.body[0]).toHaveProperty("user_id", "_test_user_1");
    expect(res.body[0]).toHaveProperty("trophy_id", "T1");
    expect(res.body[0]).toHaveProperty("likedUsers", [" "]);
  });

  test("Retrieve Photos for Non-existing User", async () => {
    const res = await agent.get("/photos/sorting/user/_test_user_100");
    expect(res.status).toStrictEqual(404);
  });

  /* // should we add auth to route to make this test work?
  test("Retrieve Photos for existing but unauthenticated User", async () => {
    const res = await request
      .agent(app)
      .get("/photos/sorting/user/_test_user_1");
    expect(res.status).toStrictEqual(401);
  });
  */

  test("Retrieve Photos for User who has never taken photos", async () => {
    const res = await agent.get("/photos/sorting/user/_test_user_2");

    expect(res.status).toStrictEqual(200);
    expect(res.body[0]).toBeUndefined();
  });
});

describe("Logout", () => {
  test("Logout Valid User with authenticated session", async () => {
    const res = await agent.post("/users/accounts/logout");

    expect(res.status).toStrictEqual(201);

    const res2 = await agent.get("/users/accounts/profiles/_test_user_1");

    expect(res2.status).toStrictEqual(401);
  });

  test("Logout Valid User with expired Sessions", async () => {
    await agent.post("/users/accounts/logout"); // make the session expired
    const res = await agent.post("/users/accounts/logout");

    expect(res.status).toStrictEqual(401); // need to be changed to 401?
  });
});

async function createTestUsers() {
  Photo.create({
    photo_id: "https://avatars.githubusercontent.com/u/20661066",
    like: 0,
    user_id: "_test_user_1",
    trophy_id: "T1",
    time: new Date().getTime(),
  });

  const testUser1 = {
    user_id: "_test_user_1",
    name: "Test User 1",
    email: "testuser1@wea.com",
    picture: "https://avatars.githubusercontent.com/u/20661066",
    friends: ["_test_user_2"],
    score: 99,
    fcm_token: null,
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
    friends: [],
    score: 321,
    fcm_token: null,
  };
  const testUser4 = {
    user_id: "_test_user_4",
    name: "Test User 4",
    email: "testuser4@wea.com",
    picture: "https://avatars.githubusercontent.com/u/65551651",
    friends: [],
    score: 158,
    fcm_token: null,
  };
  await User.upsertUser(testUser1);
  await User.upsertUser(testUser2);
  await User.upsertUser(testUser3);
  await User.upsertUser(testUser4);
}
