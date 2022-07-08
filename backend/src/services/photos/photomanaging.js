import { Photo } from "../../data/db/photo.db.js";

export async function userLikePhoto(userID, picID) {
  let photo = Photo.findPhotos(picID, "photoID");

  // in likedUsers field
  if (userID in photo.likedUsers) {
    Photo.userLikePhoto(userID, picID);
  } else {
    Photo.userUnlikePhoto(userID, picID);
  }
}

//userLikePhoto("userID", "picID");
