import * as messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import { Photo } from "../../data/db/photo.db.js";
import { TrophyUser, TrophyTrophy } from "../../data/db/trophy.db.js";

// probably should not store anything, so to keep consistency
//let photoSorting = new Map();

export async function getPhotoIDsByUserID(userId) {
  return await Photo.getPhotosByUser(userId);
}

export async function getPhotoIDsByTrophyID(trophyID, order) {
  let photos;

  // issue: need to handle other situatons
  if (order == "random") {
    photos = Photo.getRandom(trophyID, 9);
  } else if (order == "time") {
    photos = await Photo.getSortedByTime(trophyID, 9).exec();
  } else if (order == "like") {
    photos = await Photo.getSortedByLike(trophyID, 9).exec();
  }

  return photos;
}
