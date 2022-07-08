import { Photo } from "../../data/db/photo.db.js";

export async function uploadPhoto(userID, trophyID, photoURL) {
  // issue, photoID generation?
  let newphoto = new Photo({
    photo_id: "7",
    trophy_id: trophyID,
    user_id: userID,
    imageURL: photoURL,
  });

  Photo.addPhoto(newphoto);
}

export async function getImage(picID) {
  // issue, photoID generation?
  return Photo.findPhotos(picID, "photoID").select("imageURL");
}

//uploadPhoto("a", "b", "c");