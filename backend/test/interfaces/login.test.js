import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../src/utils/database.js";
import { User } from "../../src/data/db/user.db.js";

const testDbUri = "mongodb://localhost:27017/test_WEA_interface_login";

const mockUser = {
  user_id: "test-user-id",
  name: "Test User",
  email: "test.user@wea.com",
  sub: "test-user-id",
  picture: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
};

const mockVerifyIdToken = async (input) => {
  switch (input.idToken) {
    case "valid_id_token":
      const loginTicket = { getPayload: () => mockUser };
      return loginTicket;
    default:
      throw Error("Invalid idToken");
  }
};

jest.mock("google-auth-library", () => ({
  OAuth2Client: function (client_id) {
    return {
      verifyIdToken: async (input) => await mockVerifyIdToken(input),
    };
  },
}));

beforeAll(async () => {
  await connectToDatabase(testDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Login Use Case", () => {
  test("Non-existing user with a valid tokenID", async () => {
    const res = await request(app)
      .post("/users/accounts/login")
      .set("Authorization", "valid_id_token");
    
    expect(res.status).toStrictEqual(201);
    expect(res.body.user_id).toStrictEqual(mockUser.user_id);
  });

  test("Existing user with a valid tokenID", async () => {
    await User.upsertUser(mockUser);

    const res = await request(app)
      .post("/users/accounts/login")
      .set("Authorization", "valid_id_token")
    
    expect(res.status).toStrictEqual(201);
    expect(res.body.user_id).toStrictEqual(mockUser.user_id);
  });

  test("Invalid tokenID", async () => {
    const res = await request(app)
      .post("/users/accounts/login")
      .set("Authorization", "invalid_id_token")
    
    expect(res.status).toStrictEqual(400);
  });

  test("No Authorization", async () => {
    const res = await request(app)
      .post("/users/accounts/login");
    
    expect(res.status).toStrictEqual(400);
  });
});

describe("Upload FCM Token", () => {
  const agent = request.agent(app);

  beforeEach(async () => {
    await agent
      .post("/users/accounts/tester-login")
      .expect(201);
  });
  
  test("Success", async () => {
    const res = await agent
      .put("/users/accounts/fcm-token/_fcm_token_of_user_1");
    
    expect(res.status).toStrictEqual(200);
    expect(await User.findOne({user_id: "_test_user_1"})).toHaveProperty("fcm_token", "_fcm_token_of_user_1");
  });

  test("No token", async () => {
    const res = await agent
      .put("/users/accounts/fcm-token/");
    
    expect(res.status).toStrictEqual(404);
  });

  test("Unauthorized User", async () => {
    const res = await request(app)
      .put("/users/accounts/fcm-token/_fcm_token_of_user_1");
    expect(res.status).toStrictEqual(401);
  });
});
