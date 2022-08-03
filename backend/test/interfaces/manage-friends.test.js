import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../src/utils/database.js";
import { User } from "../../src/data/db/user.db.js";
import * as friends from "../../src/services/users/friends.js";

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
    const res = await agent
      .get("/users/friends/list");
    expect(res.status).toStrictEqual(200);
    expect(res.body.map(x => x.user_id)).toStrictEqual(["_test_user_2"]);
  });

  test("No Friends", async () => {
    /* Delete the friend */
    friends.deleteFriend("_test_user_1", "_test_user_2");

    const res = await agent
      .get("/users/friends/list");
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual([]);
  });

  test("Unauthorized User", async () => {
    const res = await request(app)
      .get("/users/friends/list");
    expect(res.status).toStrictEqual(401);
  });
});

describe("Manage Friends: Search for Friends", () => {
  test("Match Some", async () => {
    const res = await agent
      .get("/users/accounts/search?query=testuser3%40wea.com");
    expect(res.status).toStrictEqual(200);
    expect(res.body.map(x => x.user_id)).toStrictEqual(["_test_user_3"]);
  });

  test("No matched user", async () => {
    const res = await agent
      .get("/users/accounts/search?query=testuser99999%40wea.com");
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual([]);
  });

  test("No query", async () => {
    const res = await agent
      .get("/users/accounts/search");
    expect(res.status).toStrictEqual(400);
  });
});

describe("Manage Friends: See Friend Requests", () => {
  test("Some Requests", async () => {
    const res = await agent
      .get("/users/friends/requests");
    expect(res.status).toStrictEqual(200);
    expect(res.body.map(x => x.user_id)).toStrictEqual(["_test_user_4"]);
  });

  test("No Requests", async () => {
    friends.clearRequests();

    const res = await agent
      .get("/users/friends/requests");
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual([]);
  });

  test("Unauthorized User", async () => {
    const res = await request(app)
      .get("/users/friends/requests");
    expect(res.status).toStrictEqual(401);
  });
});

describe("Manage Friends: Send Friend Request", () => {
  test("Existing Non-Friended User", async () => {
    const res = await agent
      .post("/users/friends/send-request?targetUserId=_test_user_3");
    
    expect(res.status).toStrictEqual(200);
    expect((await friends.getFriendRequests("_test_user_3")).map(x => x.user_id)).toStrictEqual(["_test_user_1"]);
  });

  test("Unauthenticated User", async () => {
    const res = await request(app)
      .post("/users/friends/send-request?targetUserId=_test_user_3");
    expect(res.status).toStrictEqual(401);
  });

  test("Non-Existing Target User", async () => {
    const res = await agent
      .post("/users/friends/send-request?targetUserId=_test_user_99");
    
    expect(res.status).toStrictEqual(404);
    expect(await friends.getFriendRequests("_test_user_99")).toStrictEqual([]);
  });

  test("Target User is Already a Friend", async () => {
    const res = await agent
      .post("/users/friends/send-request?targetUserId=_test_user_2");
    
    expect(res.status).toStrictEqual(400);
    expect(await friends.getFriendRequests("_test_user_2")).toStrictEqual([]);
  });

  test("Same Target and Sender", async () => {
    friends.clearRequests();
    const res = await agent
      .post("/users/friends/send-request?targetUserId=_test_user_1");
    
    expect(res.status).toStrictEqual(400);
    expect(await friends.getFriendRequests("_test_user_1")).toStrictEqual([]);
  });

  test("Already Sent a Request", async () => {
    let res;
    res = await agent
      .post("/users/friends/send-request?targetUserId=_test_user_3");
    
    expect(res.status).toStrictEqual(200);
    expect((await friends.getFriendRequests("_test_user_3")).map(x => x.user_id)).toStrictEqual(["_test_user_1"]);

    res = await agent
      .post("/users/friends/send-request?targetUserId=_test_user_3");
    
    expect(res.status).toStrictEqual(400);
    expect((await friends.getFriendRequests("_test_user_3")).map(x => x.user_id)).toStrictEqual(["_test_user_1"]);
  });
});
