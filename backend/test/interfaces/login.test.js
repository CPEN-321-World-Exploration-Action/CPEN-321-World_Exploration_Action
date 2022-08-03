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
      return { getPayload: () => mockUser };
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
    
    expect(res.status === 201);
    expect(res.body.user_id).toStrictEqual(mockUser.user_id);
  });

  test("Existing user with a valid tokenID", async () => {
    await User.upsertUser(mockUser);

    const res = await request(app)
      .post("/users/accounts/login")
      .set("Authorization", "valid_id_token")
    
    expect(res.status === 201);
    expect(res.body.user_id).toStrictEqual(mockUser.user_id);
  });

  test("Invalid tokenID", async () => {
    const res = await request(app)
      .post("/users/accounts/login")
      .set("Authorization", "invalid_id_token")
    
    expect(res.status === 400);
  });
});
