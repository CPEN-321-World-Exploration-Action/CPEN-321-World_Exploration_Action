import request from "supertest";
import { app } from "../../src/app.js";
import {
  connectToDatabase,
  dropAndDisconnectDatabase,
} from "../../src/utils/database.js";
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
  await Photo.deleteMany({});

  // create an logged in user
  await agent.post("/users/accounts/tester-login").expect(201);

  // initialize relevant databases
  await createTestUsers();
});