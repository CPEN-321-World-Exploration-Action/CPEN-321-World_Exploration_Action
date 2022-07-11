import { Photo } from "../../data/db/photo.db.js";

// probably should not store anything, so to keep consistency
//let photoSorting = new Map();

export async function getPhotoIDsByUserID(userId) {
  return await Photo.getPhotosByUser(userId);
}

export async function getPhotoIDsByTrophyID(trophyID, order) {
  let photos;

  // issue: need to handle other situatons
  if (order == "random") {
    photos = await Photo.getRandom(trophyID, 9);
  } else if (order == "time") {
    photos = await Photo.getSortedByTime(trophyID, 9).exec();
  } else if (order == "like") {
    photos = await Photo.getSortedByLike(trophyID, 9).exec();
  }

  return photos;
}
