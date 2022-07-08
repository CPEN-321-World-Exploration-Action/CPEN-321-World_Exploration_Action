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
    const trophies = await TrophyTrophy.find({})
    return trophies
}

export async function createTrophy(req){
    const trophy = await TrophyTrophy.create(req.body)
    return trophy
}

