import { Photo } from "../../data/db/photo.db.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

/* Managing */
export async function userLikePhoto(userID, picID) {
  const photo = await Photo.findPhoto(picID);
  if (!photo) {
    throw new NotFoundError("Cannot find the picture");
  }
  if (photo.likedUsers.includes(userID)) {
    await Photo.userUnlikePhoto(userID, picID);
  } else {
    await Photo.userLikePhoto(userID, picID);
  }
}

/* Storing */
export async function uploadPhoto(userId, trophyId, photoId) {
  await Photo.addOrReplacePhoto(photoId, trophyId, userId);
}

/* Sorting */
export async function getPhotoIDsByUserID(userId) {
  return await Photo.getPhotosByUser(userId);
}

export async function getPhotoIDsByTrophyID(trophyID, order, userId) {
  let photos;

  if (order == "random") {
    photos = await Photo.getRandom(trophyID, 9);
  } else if (order == "time") {
    photos = await Photo.getSortedByTime(trophyID, 9);
  } else if (order == "like") {
    photos = await Photo.getSortedByLike(trophyID, 9);
  } else {
    throw new BadRequestError(`Invalid order: ${order}`);
  }

  photos = setUserLiked(photos, userId);

  return photos;
}

function setUserLiked(photos, userId) {
  return photos.map(({ likedUsers, ...attrs }) => ({
    ...attrs,
    user_liked: likedUsers.includes(userId),
  }));
}
