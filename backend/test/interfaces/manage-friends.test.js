import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../src/utils/database.js";
import { User } from "../../src/data/db/user.db.js";

const testDbUri = "mongodb://localhost:27017/test_WEA_interface_friends";

const agent = request.agent(app);

beforeAll(async () => {
  await connectToDatabase(testDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await User.deleteMany({});
  await agent
    .post("/users/accounts/tester-login")
    .expect(201);
});

describe("Manage Friends: Get User's Friends", () => {
  test("Has Friends", async () => {
    let res;
    res = await agent
      .get("/users/friends/list");
    expect(res.status).toStrictEqual(200);
    expect(res.body.map(x => x.user_id)).toStrictEqual(["_test_user_2"]);
  });

  test("No Friends", async () => {
    let res;
    /* Delete the friend */
    res = await agent
      .post("/users/friends/delete?friendId=_test_user_2");
    expect(res.status).toStrictEqual(200);

    /* Now the user has no friends */
    res = await agent
      .get("/users/friends/list");
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual([]);
  });

  test("Unauthorized User", async () => {
    let res;
    res = await request(app)
      .get("/users/friends/list");
    expect(res.status).toStrictEqual(401);
  });
});
