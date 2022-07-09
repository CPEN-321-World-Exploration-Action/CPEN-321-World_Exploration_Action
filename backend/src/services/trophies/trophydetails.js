import { TrophyUser } from "../../data/db/trophy.db.js";
import { TrophyTrophy } from "../../data/db/trophy.db.js";

export async function getTrophiesUser(userId, userLocation){
    const uncollectedTrophyIds = await TrophyUser.getUserUncollectedTrophyIDs(userId).exec();
    
    if (uncollectedTrophyIds.length < 10){
        // Get trophies from Google Places API.
        console.log('Need more Trophies')
        // Check if possible or not

        // Add Trophies to TrophyTrophy collection

        // Add TrophyIDs to TrophyUser Uncollected Tropy
    }

    // Need to get info from all trophies. 
    const trophies = []
    for (let i=0; i< uncollectedTrophyIds.length; i++){
        trophies.push(await TrophyTrophy.getTrophyText(uncollectedTrophyIds[i]));
    }
    return trophies
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
