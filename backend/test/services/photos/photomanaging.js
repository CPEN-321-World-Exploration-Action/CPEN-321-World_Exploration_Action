import { jest } from "@jest/globals";

import * as photoManaging from "../../../src/services/photos/photomanaging";
import Photo from "../../../src/data/db/photo.db.js";

describe("Photo_Managing Module userLikePhoto Test", () => {
  test("userLikePhoto", async () => {
    let userId = "User";
    let photoId = "Photo";
    /* Like */
    await photoManaging.userLikePhoto(userId, photoId);
    expect(
      await Photo.findone({
        photo_id: trophyID,
      }).likedUsers
    ).toEqual("Like list");
    expect(
      await Photo.findone({
        photo_id: trophyID,
      }).like
    ).toEqual("# Like");

    /* Unlike */
    await photoManaging.userLikePhoto(userId, photoId);
    expect(
      await Photo.findone({
        photo_id: trophyID,
      }).likedUsers
    ).toEqual("Like list");
    expect(
      await Photo.findone({
        photo_id: trophyID,
      }).like
    ).toEqual("# Like");
  });

  test("userLikePhoto_photo_not_in_DB", async () => {
    let userId = "User";
    let photoId = "PhotoNotInDB";
    expect(await photoManaging.userLikePhoto(userId, photoId)).toThrow(
      NotInDBError
    );
  });

  test("userLikePhoto_user_not_in_DB", async () => {
    let userId = "UserNotInDB";
    let photoId = "Photo";
    expect(await photoManaging.userLikePhoto(userId, photoId)).toThrow(
      NotInDBError
    );
  });

  test("userLikePhoto_invalid_input", async () => {
    let userId = "UserNotInDB";
    let photoId = "Photo";
    expect(await photoManaging.userLikePhoto(null, photoId)).toThrow(
      InputError
    );
    expect(await photoManaging.userLikePhoto(undefined, photoId)).toThrow(
      InputError
    );
    expect(await photoManaging.userLikePhoto(userId, null)).toThrow(InputError);
    expect(await photoManaging.userLikePhoto(userId, undefined)).toThrow(
      InputError
    );
  });
});

describe("Photo_Managing Module uploadPhoto Test", () => {
  /* uploadPhoto(userId, trophyId, photoId) */
  test("uploadPhoto", async () => {
    let userId = "User";
    let trophyId = "Trophy";
    let photoId = "Photo";
    // should we test this, it just called photo function...

    await addOrReplacePhoto(photoId, trophyId, userId);

    expect(
      await Photo.findone({
        user_id: userId,
        trophy_id: trophyId,
      }).photo_id
    ).toEqual(photoId);

    expect(
      await Photo.findone({
        user_id: userId,
        trophy_id: trophyId,
      }).like
    ).toEqual(0);

    expect(
      await Photo.findone({
        user_id: userId,
        trophy_id: trophyId,
      }).likedUsers
    ).toEqual([]);
  });

  test("uploadPhoto_invalid_input", async () => {
    let userId = "User";
    let trophyId = "Trophy";
    let photoId = "Photo";

    expect(await addOrReplacePhoto(null, trophyId, userId)).toThrow(InputError);

    expect(await addOrReplacePhoto(photoId, null, userId)).toThrow(InputError);

    expect(await addOrReplacePhoto(photoId, trophyId, null)).toThrow(
      InputError
    );

    expect(await addOrReplacePhoto(undefined, trophyId, userId)).toThrow(
      InputError
    );

    expect(await addOrReplacePhoto(photoId, undefined, userId)).toThrow(
      InputError
    );

    expect(await addOrReplacePhoto(photoId, trophyId, undefined)).toThrow(
      InputError
    );
  });
});

describe("Photo_Managing Module getPhotoIDsByUserID Test", () => {
  test("getPhotoIDsByUserID", async () => {
    let userId = "User";

    expect(await getPhotoIDsByUserID(userId)).toEqual("list photos");
  });

  test("getPhotoIDsByUserID_user_not_in_DB", async () => {
    let userId = "UserNotInDB";
    expect(await getPhotoIDsByUserID(userId)).toThrow(NotInDBError);
  });

  test("getPhotoIDsByUserID_user_invalid", async () => {
    expect(await getPhotoIDsByUserID(null)).toThrow(InputError);
    expect(await getPhotoIDsByUserID(undefined)).toThrow(InputError);
  });
});

describe("Photo_Managing Module getPhotoIDsByTrophyID Test", () => {
  /* getPhotoIDsByTrophyID(trophyID, order, userId) */
  test("getPhotoIDsByTrophyID", async () => {
    let userId = "User";
    let trophyId = "Trophy";
    orderRandom = "Random";
    orderLike = "Like";
    orderTime = "Time";

    expect(await getPhotoIDsByTrophyID(trophyId, orderRandom, userId)).toEqual(
      "list photos"
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderLike, userId)).toEqual(
      "list photos"
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderTime, userId)).toEqual(
      "list photos"
    );
  });

  test("getPhotoIDsByTrophyID_user_not_in_DB", async () => {
    let userId = "UserNotInDB";
    let trophyId = "Trophy";
    orderRandom = "Random";
    orderLike = "Like";
    orderTime = "Time";
    expect(await getPhotoIDsByTrophyID(trophyId, orderRandom, userId)).toThrow(
      NotInDBError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderLike, userId)).toThrow(
      NotInDBError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderTime, userId)).toThrow(
      NotInDBError
    );
  });

  test("getPhotoIDsByTrophyID_user_invalid", async () => {
    let trophyId = "Trophy";
    orderRandom = "Random";
    orderLike = "Like";
    orderTime = "Time";
    expect(await getPhotoIDsByTrophyID(trophyId, orderRandom, null)).toThrow(
      InputError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderLike, null)).toThrow(
      InputError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderTime, null)).toThrow(
      InputError
    );

    expect(
      await getPhotoIDsByTrophyID(trophyId, orderRandom, undefined)
    ).toThrow(InputError);
    expect(await getPhotoIDsByTrophyID(trophyId, orderLike, undefined)).toThrow(
      InputError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderTime, undefined)).toThrow(
      InputError
    );
  });

  test("getPhotoIDsByTrophyID_trophy_not_in_DB", async () => {
    let userId = "User";
    let trophyId = "TrophyNotInDB";
    orderRandom = "Random";
    orderLike = "Like";
    orderTime = "Time";
    expect(await getPhotoIDsByTrophyID(trophyId, orderRandom, userId)).toThrow(
      NotInDBError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderLike, userId)).toThrow(
      NotInDBError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, orderTime, userId)).toThrow(
      NotInDBError
    );
  });

  test("getPhotoIDsByTrophyID_trophy_invalid", async () => {
    let userId = "User";
    orderRandom = "Random";
    orderLike = "Like";
    orderTime = "Time";
    expect(await getPhotoIDsByTrophyID(null, orderRandom, userId)).toThrow(
      InputError
    );
    expect(await getPhotoIDsByTrophyID(null, orderLike, userId)).toThrow(
      InputError
    );
    expect(await getPhotoIDsByTrophyID(null, orderTime, userId)).toThrow(
      InputError
    );

    expect(await getPhotoIDsByTrophyID(undefined, orderRandom, userId)).toThrow(
      InputError
    );
    expect(await getPhotoIDsByTrophyID(undefined, orderLike, userId)).toThrow(
      InputError
    );
    expect(await getPhotoIDsByTrophyID(undefined, orderTime, userId)).toThrow(
      InputError
    );
  });

  test("getPhotoIDsByTrophyID_order_invalid", async () => {
    let userId = "User";
    let trophyId = "Trophy";
    orderInvalid = "Invalid";
    expect(await getPhotoIDsByTrophyID(trophyId, orderInvalid, userId)).toThrow(
      BadRequestError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, null, userId)).toThrow(
      BadRequestError
    );
    expect(await getPhotoIDsByTrophyID(trophyId, undefined, userId)).toThrow(
      BadRequestError
    );
  });
});
