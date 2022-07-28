import { jest } from "@jest/globals";

import * as trophyCollection from "../../../src/services/trophies/trophycollection.js";
import { TrophyUser, TrophyTrophy } from "../../../src/data/db/trophy.db.js";

jest.mock("../../../src/utils/message-manager.js");

// need to update the dataset for test
TrophyUser.findOrCreate("User_TrophyCollection_Test");
TrophyUser.updateOne(
  { user_id: "User_TrophyCollection_Test" },
  {
    $set: {
      uncollectedTrophies: [" "],
      collectedTrophies: [" "],
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

TrophyUser.updateOne(
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

describe("Trophy_Collection Module collectTrophy Test", () => {
  /* collectTrophy tests */
  test("collectTrophy", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    // returns nothing
    await trophyCollection.collectTrophy(userId, trophyId);

    /* Change in database */
    expect(
      await TrophyUser.findOne({ user_id: userId }).uncollectedTrophies
    ).toEqual("need to mock");
    expect(
      await TrophyUser.findOne({ user_id: userId }).collectedTrophies
    ).toBe("need to mock");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).list_of_collectors
    ).toBe("need to mock");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).number_of_collectors
    ).toBe("need to mock");
    /* MessageManager Part - score matters */
    expect();
  });

  test("collectTrophy_trophy_is_collected", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    expect(await trophyCollection.collectTrophy(userId, trophyId)).toThrow(
      DuplicationError
    );
    /* Change in database */
    expect(
      await TrophyUser.findOne({ user_id: userId }).uncollectedTrophies
    ).toBe("need to mock to be the same");
    expect(
      await TrophyUser.findOne({ user_id: userId }).collectedTrophies
    ).toBe("need to mock to be the same");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).list_of_collectors
    ).toBe("need to mock to be the same");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).number_of_collectors
    ).toBe("need to mock to be the same");
  });

  test("collectTrophy_invalid_userId", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    expect(await trophyCollection.collectTrophy(null, trophyId)).toThrow(
      InputError
    );
    /* Change in database */
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).list_of_collectors
    ).toBe("need to mock to be the same");
    expect(
      await TrophyTrophy.findOne({
        trophy_id: trophyID,
      }).number_of_collectors
    ).toBe("need to mock to be the same");
  });

  test("collectTrophy_invalid_trophyId", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    expect(await trophyCollection.collectTrophy(userId, null)).toThrow(
      InputError
    );
    /* Change in database */
    expect(
      await TrophyUser.findOne({ user_id: userId }).uncollectedTrophies
    ).toBe("need to mock to be the same");
    expect(
      await TrophyUser.findOne({ user_id: userId }).collectedTrophies
    ).toBe("need to mock to be the same");
  });

  test("collectTrophy_both_invalid", async () => {
    userId = "User_TrophyCollection_Test";
    trophyId = "Trophy_TrophyCollection_Test";

    expect(await trophyCollection.collectTrophy(null, null)).toThrow(
      InputError
    );
  });
});
