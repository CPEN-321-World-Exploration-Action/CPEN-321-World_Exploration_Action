import { jest } from "@jest/globals";

import * as trophyCollection from "../../../src/services/trophies/trophycollection.js";
import { TrophyUser, TrophyTrophy } from "../../../src/data/db/trophy.db.js";

jest.mock("../../../src/utils/__mocks__/message-manager.js");

trophyCollection.buildTrophyCollectedMessage = jest.fn();

// need to update the dataset for test
function initialize_database() {
  TrophyUser.findOrCreate("User_TrophyCollection_Test");
  TrophyUser.updateOne(
    { user_id: "User_TrophyCollection_Test" },
    {
      $set: {
        uncollectedTrophies: [" ", "Trophy_TrophyCollection_Test"],
        collectedTrophies: [" ", "Trophy_TrophyCollection_Test_Collected"],
        list_of_photos: [" "],
        trophyTags: [" "],
      },
    }
  );

  let Trophy_Test = await TrophyTrophy.findOne({
    trophy_id: "Trophy_TrophyCollection_Test",
  }).exec();
  if (!Trophy_Test) {
    await TrophyTrophy.create({ trophy_id: "Trophy_TrophyCollection_Test" });
  }

  TrophyTrophy.updateOne(
    { trophy_id: "Trophy_TrophyCollection_Test" },
    {
      $set: {
        name: "Trophy_TrophyCollection_Test",
        latitude: 100,
        longitude: 100,
        number_of_collectors: 0,
        quality: "Bronze",
        list_of_photos: [" "],
        list_of_collectors: [" "],
      },
    }
  );

  let Trophy_Test2 = await TrophyTrophy.findOne({
    trophy_id: "Trophy_TrophyCollection_Test_Collected",
  }).exec();
  if (!Trophy_Test2) {
    await TrophyTrophy.create({ trophy_id: "Trophy_TrophyCollection_Test_Collected" });
  }

  TrophyTrophy.updateOne(
    { trophy_id: "Trophy_TrophyCollection_Test_Collected" },
    {
      $set: {
        name: "Trophy_TrophyCollection_Test_Collected",
        latitude: 200,
        longitude: 200,
        number_of_collectors: 1,
        quality: "Bronze",
        list_of_photos: [" "],
        list_of_collectors: [" ", "User_TrophyCollection_Test"],
      },
    }
  );
}

describe("Trophy_Collection Module collectTrophy Test", () => {
  /* collectTrophy tests */
  test("collectTrophy", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    initialize_database();

    // returns message
    /*
    expect(
      await trophyCollection.collectTrophy(userId, trophyId)
    ).toBe({
      type: "trophy_collected",
      userId: "User_TrophyCollection_Test",
      trophyId: "Trophy_TrophyCollection_Test",
      trophyScore: 1,
    });
    */

    await trophyCollection.collectTrophy(userId, trophyId);

    /* Change in database */
    expect(
      await TrophyUser.findOne({ user_id: userId }).uncollectedTrophies
    ).not.toContain("Trophy_TrophyCollection_Test");
    expect(
      await TrophyUser.findOne({ user_id: userId }).collectedTrophies
    ).toContain("Trophy_TrophyCollection_Test");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).list_of_collectors
    ).toContain("User_TrophyCollection_Test");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).number_of_collectors
    ).toEqual(1);

    expect(trophyCollection.buildTrophyCollectedMessage).toHaveBeenCalledWith(userId, trophyId, 1);

    // idk if the format is correct
    expect(trophyCollection.buildTrophyCollectedMessage).toHaveReturnedWith({
      type: "trophy_collected",
      userId: userId,
      trophyId: trophyId,
      trophyScore: 1,
    })
  });

  test("collectTrophy_trophy_is_collected", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test_Collected";

    initialize_database();

    expect(await trophyCollection.collectTrophy(userId, trophyId)).toThrow(
      DuplicationError
    );
    /* Change in database */
    expect(
      await TrophyUser.findOne({ user_id: userId }).uncollectedTrophies
    ).toContain("Trophy_TrophyCollection_Test");
    expect(
      await TrophyUser.findOne({ user_id: userId }).uncollectedTrophies
    ).not.toContain(trophyId);
    expect(
      await TrophyUser.findOne({ user_id: userId }).collectedTrophies
    ).not.toContain("Trophy_TrophyCollection_Test");
    expect(
      await TrophyUser.findOne({ user_id: userId }).collectedTrophies
    ).toContain(trophyId);
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).list_of_collectors
    ).toContain("User_TrophyCollection_Test");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).number_of_collectors
    ).toEqual(1);
  });

  test("collectTrophy_invalid_userId", async () => {
    //userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    initialize_database();

    expect(await trophyCollection.collectTrophy(null, trophyId)).toThrow(
      InputError
    );
    /* Change in database */
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).list_of_collectors
    ).toBe([" "]);
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).number_of_collectors
    ).toBe(0);
  });

  test("collectTrophy_invalid_trophyId", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    initialize_database();

    expect(await trophyCollection.collectTrophy(userId, null)).toThrow(
      InputError
    );
    /* Change in database */
    expect(
      await TrophyUser.findOne({ user_id: userId }).uncollectedTrophies
    ).toBe([" ", "Trophy_TrophyCollection_Test"]);
    expect(
      await TrophyUser.findOne({ user_id: userId }).collectedTrophies
    ).toBe([" ", "Trophy_TrophyCollection_Test_Collected"]);
  });

  test("collectTrophy_both_invalid", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    initialize_database();

    expect(await trophyCollection.collectTrophy(null, null)).toThrow(
      InputError
    );
  });
});
