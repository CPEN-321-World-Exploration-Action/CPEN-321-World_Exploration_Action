import { jest } from "@jest/globals";

import * as trophyCollection from "../../../src/services/trophies/trophycollection.js";
import { TrophyUser, TrophyTrophy } from "../../../src/data/db/trophy.db.js";

describe("Trophy_Collection Module collectTrophy Test", () => {
  /* collectTrophy tests */
  test("collectTrophy", async () => {
    /*
    expect(await trophyCollection.collectTrophy(userId, trophyId)).toBe(
      mockGlobalLeaderboard
    );
    */
    /* Change in database */
    expect(
      await TrophyUser.findOrCreate({ user_id: userId }).uncollectedTrophies
    ).toBe("need to mock");
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
    expect(await trophyCollection.collectTrophy(userId, null)).toThrow(
      InputError
    );
  });
});
