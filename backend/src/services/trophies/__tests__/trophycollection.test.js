import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { BadRequestError, NotFoundError, InputError } from "../../../utils/errors.js";

import * as trophyCollection from "../trophycollection.js";
import { TrophyUser, TrophyTrophy } from "../../../data/db/trophy.db.js";
import * as messageManager from "../../../utils/message-manager.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../../utils/database.js";

jest.mock("../../../utils/message-manager.js");

// database connection
const defaultDbUri = "mongodb://localhost:27017/trophycollection_test";

beforeAll(async () => {
  await connectToDatabase(defaultDbUri);
});

beforeEach(async () => {
  await initialize_database_for_trophycollection();
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

// need to update the dataset for test

describe("Trophy_Collection Module collectTrophy Test", () => {
  /* collectTrophy tests */

  test("collectTrophy", async () => {

    const userId = "User_TrophyCollection_Test";
    const trophyId = "Trophy_TrophyCollection_Test";

    await trophyCollection.collectTrophy(userId, trophyId);

    //console.log(await TrophyUser.findOne({ user_id: userId }).exec());
    //console.log((await TrophyUser.findOne({ user_id: userId }).exec()).uncollectedTrophies);

    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).uncollectedTrophies
    ).not.toContain(trophyId);
    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).collectedTrophies
    ).toContain(trophyId);
    expect(
      (await TrophyTrophy.findOne({
        trophy_id: trophyId,
      }).exec()).list_of_collectors
    ).toContain(userId);
    expect(
      (await TrophyTrophy.findOne({ trophy_id: trophyId }).exec()).number_of_collectors
    ).toEqual(1);

    expect(messageManager.publishNewMessage).toHaveBeenCalledWith({
      type: "trophy_collected",
      userId: userId,
      trophyId: trophyId,
      trophyScore: 1,
    });

  });

  test("collectTrophy_trophy_is_collected", async () => {
    const userId = "User_TrophyCollection_Test";
    const trophyId = "Trophy_TrophyCollection_Test_Collected";

    expect(async () => await trophyCollection.collectTrophy(userId, trophyId)).rejects.toThrow(
      BadRequestError
    );

    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).uncollectedTrophies
    ).toContain("Trophy_TrophyCollection_Test");
    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).uncollectedTrophies
    ).not.toContain(trophyId);
    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).collectedTrophies
    ).not.toContain("Trophy_TrophyCollection_Test");
    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).collectedTrophies
    ).toContain(trophyId);
    expect(
      (await TrophyTrophy.findOne({
        trophy_id: trophyId,
      }).exec()).list_of_collectors
    ).toContain("User_TrophyCollection_Test");
    expect(
      (await TrophyTrophy.findOne({
        trophy_id: trophyId,
      }).exec()).number_of_collectors
    ).toEqual(1);
  });

  test("collectTrophy_invalid_userId", async () => {
    //userId = "User_TrophyCollection_Test";
    const trophyId = "Trophy_TrophyCollection_Test";

    expect(async () => await trophyCollection.collectTrophy(null, trophyId)).rejects.toThrow(
      InputError
    );

    console.log((await TrophyTrophy.findOne({
      trophy_id: trophyId,
    }).exec()).list_of_collectors);

    expect(
      (await TrophyTrophy.findOne({
        trophy_id: trophyId,
      }).exec()).list_of_collectors
    ).toStrictEqual([" "]);
    expect(
      (await TrophyTrophy.findOne({
        trophy_id: trophyId,
      }).exec()).number_of_collectors
    ).toBe(0);
  });

  test("collectTrophy_invalid_trophyId", async () => {
    const userId = "User_TrophyCollection_Test";

    expect(async () => await trophyCollection.collectTrophy(userId, null)).rejects.toThrow(
      InputError
    );

    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).uncollectedTrophies
    ).toStrictEqual([" ", "Trophy_TrophyCollection_Test"]);
    expect(
      (await TrophyUser.findOne({ user_id: userId }).exec()).collectedTrophies
    ).toStrictEqual([" ", "Trophy_TrophyCollection_Test_Collected"]);
  });

  test("collectTrophy_both_invalid", async () => {
    expect(async () => await trophyCollection.collectTrophy(undefined, null)).rejects.toThrow(
      InputError
    );
  });
});

async function initialize_database_for_trophycollection() {
  await TrophyTrophy.deleteMany({});
  await TrophyUser.deleteMany({});

  await TrophyUser.create({
    user_id: "User_TrophyCollection_Test",
    uncollectedTrophies: [" ", "Trophy_TrophyCollection_Test"],
    collectedTrophies: [" ", "Trophy_TrophyCollection_Test_Collected"],
    list_of_photos: [" "],
    trophyTags: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "Trophy_TrophyCollection_Test",
    name: "Trophy_TrophyCollection_Test",
    latitude: 100,
    longitude: 100,
    number_of_collectors: 0,
    quality: "Bronze",
    list_of_photos: [" "],
    list_of_collectors: [" "],
  });

  await TrophyTrophy.create({
    trophy_id: "Trophy_TrophyCollection_Test_Collected",
    name: "Trophy_TrophyCollection_Test_Collected",
    latitude: 200,
    longitude: 200,
    number_of_collectors: 1,
    quality: "Bronze",
    list_of_photos: [" "],
    list_of_collectors: [" ", "User_TrophyCollection_Test"],
  });
}
