import { User } from "../../data/db/user.db.js";
import { TrophyUser, TrophyTrophy } from "../../data/db/trophy.db.js";
import { Photo } from "../../data/db/photo.db.js";

export async function getPhotoIDsByTrophyID(trophyID, order){
    let photos = [];

    // issue: need to handle other situatons
    if (order == "random"){
        photos = Photo.getRandom(trophyID, 9);
    }
    else if (order == "time"){
        photos = Photo.getSortedByTime(trophyID, 9);
    }
    else if (order == "like"){
        photos = Photo.getSortedByLike(trophyID, 9);
    }

    return photos;
}
