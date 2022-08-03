import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../src/utils/database.js";
import { Photo } from "../../src/data/db/photo.db.js";

const testDbUri = "mongodb://localhost:27017/test_WEA_interface_collect_trophy";

const agent = request.agent(app);
let photoId;

beforeAll(async () => {
  await connectToDatabase(testDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await Photo.deleteMany({});

  await agent
    .post("/users/accounts/tester-login")
    .expect(201);

  const res = await agent
    .post("/photos/storing/ChIJrf8w27NyhlQR44St4PQccfY/_test_user_1")
    .attach("photo", "test/res/test_photo.png")
    .expect(201);
  photoId = res.body.photoId;
  console.log("PhotoId is " + photoId);
});

describe("Evaluate Photos: Open Photo", () => {
  test("Existing Image", async () => {
    const res = await agent.get(`/photos/storing/${photoId}`);
    expect(res.status).toStrictEqual(200);
  });

  test("Non-Existing Image", async () => {
    const res = await agent.get(`/photos/storing/123456`);
    expect(res.status).toStrictEqual(404);
  });
});

describe("Evaluate Photos: Like Photo", () => {
  test("Not Liked Photo", async () => {
    const res = await agent.put(`/photos/managing/likes?userID=_test_user_1&picID=${photoId}`);

    expect(res.status).toStrictEqual(200);
    expect((await Photo.findPhoto(photoId)).likedUsers).toEqual(expect.arrayContaining(["_test_user_1"]));
  });

  test("Liked Photo", async () => {
    await agent.put(`/photos/managing/likes?userID=_test_user_1&picID=${photoId}`);
    const res = await agent.put(`/photos/managing/likes?userID=_test_user_1&picID=${photoId}`);

    expect(res.status).toStrictEqual(200);
    expect((await Photo.findPhoto(photoId)).likedUsers).not.toEqual(expect.arrayContaining(["_test_user_1"]));
  });

  test("Unauthorized User", async () => {
    const res = await request(app).put(`/photos/managing/likes?userID=_test_user_1&picID=${photoId}`);
    expect(res.status).toStrictEqual(401);
  });

  test("Non-Existing Photo", async () => {
    const res = await agent.put(`/photos/managing/likes?userID=_test_user_1&picID=123456`);
    expect(res.status).toStrictEqual(404);
  });
});
