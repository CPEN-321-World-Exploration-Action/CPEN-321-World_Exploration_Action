import mongoose from "mongoose";
import { jest } from "@jest/globals";
import { BadRequestError, NotFoundError, InputError, DuplicationError, NotInDBError } from "../../../src/utils/errors.js";

import * as trophyDetail from "../../../src/services/trophies/trophydetails.js";
import { TrophyUser, TrophyTrophy } from "../../../src/data/db/trophy.db.js";
import * as Places from "../../../src/data/external/__mocks__/googleplaces.external.js";

jest.mock("../../../src/data/external/googleplaces.external.js");

// database connection
const defaultDbUri = "mongodb://localhost:27017/trophydetails_test";

async function initialize_trophy_database() {
  trophyUpdateOrCreate("Trophy_Rose_Garden");
  await TrophyTrophy.updateOne(
    { trophy_id: "Trophy_Rose_Garden" },
    {
      $set: {
        name: "Rose_Garden",
        latitude: 49.2694,
        longitude: -123.2565,
        number_of_collectors: 1,
        quality: "Silver",
        list_of_photos: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
        ],
        list_of_collectors: ["User_2"]
      },
    });

  trophyUpdateOrCreate("Trophy_Wreck_Beach");
  await TrophyTrophy.updateOne(
    { trophy_id: "Trophy_Wreck_Beach" },
    {
      $set: {
        name: "Wreck_Beach",
        latitude: 49.2622,
        longitude: -123.2615,
        number_of_collectors: 3,
        quality: "Bronze",
        list_of_photos: [
          "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSgwbtyZJOXnromXn-b-mFTlCTjm6iFKq0424DBguh_CYFYuqyY6Paeez94zfJv8FO8",
          "https://media-cdn.tripadvisor.com/media/photo-m/1280/19/1e/7d/b3/photo0jpg.jpg",
        ],
        list_of_collectors: ["User_1", "User_2"]
      },
    });

  trophyUpdateOrCreate("Trophy_Granville_Island");
  await TrophyTrophy.updateOne(
    { trophy_id: "Trophy_Granville_Island" },
    {
      $set: {
        name: "Granville_Island",
        latitude: 49.2712,
        longitude: -123.134,
        number_of_collectors: 0,
        quality: "Gold",
        list_of_photos: [" "],
        list_of_collectors: [" "],
      },
    });
}

async function initialize_user_database() {
  // user 1
  await TrophyUser.findOrCreate("User_1");
  await TrophyUser.updateOne(
    { user_id: "User_1" },
    {
      $set: {
        uncollectedTrophies: [" ", "Trophy_Rose_Garden", "Trophy_Granville_Island"], // to be determined
        collectedTrophies: [" ", "Trophy_Wreck_Beach"],
        list_of_photos: [" "], // no matter in this case
        trophyTags: [" "], // no matter in this case
      },
    }
  );

  await TrophyUser.findOrCreate("User_2");
  await TrophyUser.updateOne(
    { user_id: "User_1" },
    {
      $set: {
        uncollectedTrophies: [" ", "Trophy_Granville_Island"], // to be determined
        collectedTrophies: [" ", "Trophy_Rose_Garden", "Trophy_Wreck_Beach"],
        list_of_photos: [" "], // no matter in this case
        trophyTags: [" "], // no matter in this case
      },
    }
  );

  await TrophyUser.findOrCreate("User_3");
  await TrophyUser.updateOne(
    { user_id: "User_1" },
    {
      $set: {
        uncollectedTrophies: [" ", "Trophy_Granville_Island", "Trophy_Rose_Garden", "Trophy_Wreck_Beach"], // to be determined
        collectedTrophies: [" "],
        list_of_photos: [" "], // no matter in this case
        trophyTags: [" "], // no matter in this case
      },
    }
  );
}

async function trophyUpdateOrCreate(trophy_id) {
  let Trophy_Test = await TrophyTrophy.findOne({
    trophy_id: trophy_id,
  }).exec();
  if (!Trophy_Test) {
    await TrophyTrophy.create({ trophy_id: trophy_id, latitude: 0, longitude: 0 });
  }
}

beforeAll(async () => {
  await connectToDatabase(defaultDbUri);
});

afterAll(async () => {
  await dropAndDisconnectDatabase();
});

beforeEach(async () => {
  await initialize_trophy_database();
  await initialize_user_database();
});

/*
describe("Trophy_Detail Module getTrophiesUser Test", () => {
  /* Trophy[] getTrophiesUser(String userId, double lat, double lon) */
/*
test("getTrophiesUser", async () => {
  // the number of userId’s
  // uncollected trophies is less
  // than MAX_TROPHIES
  let lat = 49.264320; // chosen value of location, around Networks of Centres of Excellence Campus Security
  let lon = -123.251574;
  let userId = "User_TrophyDetail_Test";

  expect(trophyDetail.getTrophiesUser(userId, lat, lon)).toEqual(
    "the list of uncollected Trophy"
  );
  expect(
    (await TrophyUser.findOne({
      user_id: userId,
    }).exec()).uncollectedTrophies
  ).toEqual("need to mock, the new generated Trophies");
  expect(
    (await TrophyUser.findOne({
      user_id: userId,
    }).exec()).uncollectedTrophies.length
  ).toEqual("some number");
});

/**
test("getTrophiesUser_user_has_collected", async () => {
  // the number of userId’s
  // uncollected trophies is less
  // than MAX_TROPHIES
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
*/

describe("Trophy_Detail Module getTrophyDetails Test", () => {
  test("getTrophyDetails", async () => {
    let trophyId = "Trophy_Rose_Garden";

    let trophyDetails = await trophyDetail.getTrophyDetails(trophyId);

    expect(trophyDetails[0]).toHaveProperty(
      "trophy_id", "Trophy_Rose_Garden");
    expect(trophyDetails[0]).toHaveProperty(
      "name", "Rose_Garden");
    expect(trophyDetails[0]).toHaveProperty(
      "latitude", 49.2694);
    expect(trophyDetails[0]).toHaveProperty(
      "longitude", -123.2565);
    expect(trophyDetails[0]).toHaveProperty(
      "number_of_collectors", 1);
    expect(trophyDetails[0]).toHaveProperty(
      "quality", "Silver");
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_photos", [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
    ]);
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_collectors", ["User_2"]);
  });

  test("getTrophyDetailsMultiple", async () => {
    let trophyId = ["Trophy_Rose_Garden", "Trophy_Granville_Island"];
    let trophyDetails = await trophyDetail.getTrophyDetails(trophyId);

    expect(trophyDetails[1]).toHaveProperty(
      "trophy_id", "Trophy_Rose_Garden");
    expect(trophyDetails[1]).toHaveProperty(
      "name", "Rose_Garden");
    expect(trophyDetails[1]).toHaveProperty(
      "latitude", 49.2694);
    expect(trophyDetails[1]).toHaveProperty(
      "longitude", -123.2565);
    expect(trophyDetails[1]).toHaveProperty(
      "number_of_collectors", 1);
    expect(trophyDetails[1]).toHaveProperty(
      "quality", "Silver");
    expect(trophyDetails[1]).toHaveProperty(
      "list_of_photos", [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aramaki_rose_park04s2400.jpg/450px-Aramaki_rose_park04s2400.jpg",
    ]);
    expect(trophyDetails[1]).toHaveProperty(
      "list_of_collectors", ["User_2"]);

    expect(trophyDetails[0]).toHaveProperty(
      "trophy_id", "Trophy_Granville_Island");
    expect(trophyDetails[0]).toHaveProperty(
      "name", "Granville_Island");
    expect(trophyDetails[0]).toHaveProperty(
      "latitude", 49.2712);
    expect(trophyDetails[0]).toHaveProperty(
      "longitude", -123.134);
    expect(trophyDetails[0]).toHaveProperty(
      "number_of_collectors", 0);
    expect(trophyDetails[0]).toHaveProperty(
      "quality", "Gold");
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_photos", [" "]);
    expect(trophyDetails[0]).toHaveProperty(
      "list_of_collectors", [" "]);
  });

  test("getTrophyDetails_invalid_TrophyID", async () => {
    expect(async () => await trophyDetail.getTrophyDetails(null)).rejects.toThrow(InputError);
    expect(async () => await trophyDetail.getTrophyDetails(undefined)).rejects.toThrow(InputError);
    expect(async () => await trophyDetail.getTrophyDetails(NaN)).rejects.toThrow(InputError);
  });

  test("getTrophyDetails", async () => {
    let trophyId = "TrophyNotInDB";
    expect(async () => trophyDetail.getTrophyDetails(trophyId)).rejects.toThrow(NotInDBError);
  });
});

export async function connectToDatabase(dbUrl) {
  await mongoose.connect(dbUrl);
}

export async function dropAndDisconnectDatabase() {

  /*
  try {
    await mongoose.connection.db.dropDatabase();
  } catch (err) { }
  await mongoose.connection.close();
  */

}