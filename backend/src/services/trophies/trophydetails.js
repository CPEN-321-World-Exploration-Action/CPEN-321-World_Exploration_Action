import { TrophyUser } from "../../data/db/trophy.db.js";
import { TrophyTrophy } from "../../data/db/trophy.db.js";

export async function getUser(user_id){
    return await TrophyUser.findOne({user_id:user_id});
}

export async function getTrophiesUser(user_id, user_latitude, user_longitude){
    const uncollectedTrophyIds = await TrophyUser.getUserUncollectedTrophyIDs(user_id);
    console.log(uncollectedTrophyIds)
    if (uncollectedTrophyIds.length < 10){
        // Get trophies from Google Places API.
        console.log('Need more Trophies')
        // Check if possible or not

        // Add Trophies to TrophyTrophy collection

        // Add TrophyIDs to TrophyUser Uncollected Tropy
    }

    // Need to get info from all trophies. 
    let trophies = []
    for (let i=0; i< uncollectedTrophyIds.length; i++){
        trophies.push(await TrophyTrophy.getTrophyText(uncollectedTrophyIds[i]));
    }
    return trophies
}

export async function createTrophyUser(body){
   return await TrophyUser.create(body)
}

export async function getTrophyUser(user_id){
    return await TrophyUser.findOne({user_id:user_id})
}

export async function deleteTrophyUser(user_id){
    return await TrophyUser.findOneAndDelete({user_id:user_id})
}

// Dev function
export async function getAllTrophies(){
    return await TrophyTrophy.find({})
}

export async function createTrophy(req){
    return await TrophyTrophy.create(req.body)
}

export async function deleteTrophy(trophyID){
    return await TrophyTrophy.findOneAndDelete({trophy_id:trophyID})
}

export async function updateTrophy(trophyID, body){
    return await TrophyTrophy.findOneAndUpdate({trophy_id:trophyID},body, {
        new: true, 
        runValidators: true
    })
}
