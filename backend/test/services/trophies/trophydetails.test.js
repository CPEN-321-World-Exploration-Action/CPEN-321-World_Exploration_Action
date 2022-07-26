import { jest } from "@jest/globals";

import * as trophyDetail from "../../../src/services/trophies/trophydetails.js";
import { TrophyUser, TrophyTrophy } from "../../../src/data/db/trophy.db.js";

describe("Trophy_Detail Module getTrophiesUser Test", () => {
  /* Trophy[] getTrophiesUser(String userId, double lat, double lon) */
  test("getTrophiesUser", async () => {
    /* the number of userId’s
    uncollected trophies is less
    than MAX_TROPHIES */
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toEqual(
      "the list of uncollected Trophy"
    );
    expect(
      TrophyUser.findOne({
        user_id: userId,
      }).uncollectedTrophies
    ).toEqual("need to mock, the new generated Trophies");
    expect(
      TrophyUser.findOne({
        user_id: userId,
      }).uncollectedTrophies.length
    ).toEqual(trophyDetail.MAX_TROPHIES);
  });

  test("getTrophiesUser_user_has_collected", async () => {
    /* the number of userId’s
    uncollected trophies is less
    than MAX_TROPHIES */
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toEqual(
      "the list of uncollected Trophy".concat(
        TrophyUser.findOne({
          user_id: userId,
        }).collectedTrophies
      )
    );
    expect(
      TrophyUser.findOne({
        user_id: userId,
      }).uncollectedTrophies
    ).toEqual("need to mock, the new generated Trophies");
    expect(
      TrophyUser.findOne({
        user_id: userId,
      }).uncollectedTrophies.length
    ).toEqual(trophyDetail.MAX_TROPHIES);
  });

  test("getTrophiesUser_user_no_uncollected_trophy_near", async () => {
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toEqual(
      "the list of uncollected Trophy".concat(
        TrophyUser.findOne({
          user_id: userId,
        }).collectedTrophies
      )
    );
    expect(
      TrophyUser.findOne({
        user_id: userId,
      }).uncollectedTrophies
    ).toEqual("need to mock, the new generated Trophies");
    expect(
      TrophyUser.findOne({
        user_id: userId,
      }).uncollectedTrophies.length
    ).toEqual(trophyDetail.MAX_TROPHIES);
  });

  test("getTrophiesUser_user_too_many", async () => {
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toEqual(
      "the list of uncollected Trophy".concat(
        TrophyUser.findOne({
          user_id: userId,
        }).collectedTrophies
      )
    );
    expect(
      TrophyUser.findOne({
        user_id: userId,
      }).uncollectedTrophies
    ).toEqual("should be the same");
  });

  test("getTrophiesUser_no_trophies", async () => {
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toBeNull();
  });

  test("getTrophiesUser_null_lat_lon", async () => {
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(trophyDetail.getTrophiesUser(userId, null, lon)).toThrow(InputError);
    expect(trophyDetail.getTrophiesUser(userId, lat, null)).toThrow(InputError);
    expect(trophyDetail.getTrophiesUser(userId, null, null)).toThrow(InputError);
  });

  test("getTrophiesUser_undefined_lat_lon", async () => {
    let lat = 123;
    let lon = 123;
    let userId = "User1";
    expect(trophyDetail.getTrophiesUser(userId, undefined, lon)).toThrow(InputError);
    expect(trophyDetail.getTrophiesUser(userId, lat, undefined)).toThrow(InputError);
    expect(trophyDetail.getTrophiesUser(userId, undefined, undefined)).toThrow(InputError);
  });

  test("getTrophiesUser_invalid_userId", async () => {
    let lat = 123;
    let lon = 123;
    let userId = null;
    expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toThrow(InputError);
  });
  
  test("getTrophiesUser_userId_not_in_DB", async () => {
    let lat = 123;
    let lon = 123;
    let userId = "UserNotInDB";
    expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toThrow(NotInDBError);
  });
});

describe("Trophy_Detail Module getTrophyDetails Test", () => {
    test("getTrophyDetails", async () => {
        let trophyId = "Trophy";
        expect(trophyDetail.getTrophyDetails(trophyId)).toEqual("TrophyTrophy");
    });

    test("getTrophyDetails_invalid_TrophyID", async () => {
        expect(trophyDetail.getTrophyDetails(null)).toThrow(InputError);
        expect(trophyDetail.getTrophyDetails(undefined)).toThrow(InputError);
        expect(trophyDetail.getTrophyDetails(NaN)).toThrow(InputError);
    });

    test("getTrophyDetails", async () => {
        let trophyId = "TrophyNotInDB";
        expect(trophyDetail.getTrophyDetails(trophyId)).toThrow(NotInDBError);
    });
});