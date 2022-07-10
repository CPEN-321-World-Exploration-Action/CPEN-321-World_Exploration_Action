import { Photo } from "../../data/db/photo.db.js";

export async function userLikePhoto(userID, picID) {
  let photo = await Photo.findPhotos(picID, "photoID");

  // in likedUsers field
  if (photo[0].likedUsers.includes(userID)) {
    Photo.userUnlikePhoto(userID, picID);
  } else {
    Photo.userLikePhoto(userID, picID);
  }
  
}

//userLikePhoto("userID", "picID");
