import messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";
import { Photo } from "../../data/db/photo.db.js";

// probably should not store anything, so to keep consistency
//let photoSorting = new Map();


export async function getPhotoIDsByUserID(String userID){

    /*
    photoList = photoSorting.get(userID);

    if (photoList == null){
        // if cannot find in the photoSorting, this method need to be added to PhotoDB
        photos = Photo.findPhotos(userID, "userID");
        photoSorting.set(userID, photos); // add item to the photoSorting
        photoList = photos;
    }
    */

    photos = Photo.findPhotos(userID, "userID");
    photoSorting.set(userID, photos); // add item to the photoSorting
    photoList = photos;

    return photoList;
}
