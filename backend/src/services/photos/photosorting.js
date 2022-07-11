import { Photo } from "../../data/db/photo.db.js";
import { BadRequestError } from "../../utils/errors.js";

export async function getPhotoIDsByUserID(userId) {
  return await Photo.getPhotosByUser(userId);
}

export async function getPhotoIDsByTrophyID(trophyID, order) {
  let photos;

  // issue: need to handle other situatons
  if (order == "random") {
    photos = await Photo.getRandom(trophyID, 9);
  } else if (order == "time") {
    photos = await Photo.getSortedByTime(trophyID, 9);
  } else if (order == "like") {
    photos = await Photo.getSortedByLike(trophyID, 9);
  } else {
    throw new BadRequestError(`Invalid order: ${order}`);
  }

  return photos;
}
