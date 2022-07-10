import * as Places from "../../data/external/googleplaces.external";
import { TrophyUser } from "../../data/db/trophy.db.js";
import { TrophyTrophy } from "../../data/db/trophy.db.js";

export async function getTrophiesUser(user_id, user_latitude, user_longitude){
    let uncollectedTrophyIds = await TrophyUser.getUserUncollectedTrophyIDs(user_id);

    if (uncollectedTrophyIds.length < 10){

        try{
            const numberOfNewTrophies = 10 - uncollectedTrophyIds.length
            const locations = await Places.getPlaces(user_latitude, user_longitude, numberOfNewTrophies )
            
            if (!locations){
                console.log('No Locations found near User')
                return null // Handle null trophies in controllers.
            }
            // Convert locations into New Trophies, added into the TrophyTrophy Database
            const newTrophies = await createManyTrophies(locations)
            
            // Add TrophyIds to the Users list of Uncollected Trophy Ids

        }catch (error){
            console.log(error)
        }
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

export async function createManyTrophies(trophies){
    return await TrophyTrophy.insertMany(trophies)
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
