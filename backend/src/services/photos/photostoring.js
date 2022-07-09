import { Photo } from "../../data/db/photo.db.js";

export async function uploadPhoto(userId, trophyId, photoId) {
  await Photo.addOrReplacePhoto(photoId, trophyId, userId);
}
