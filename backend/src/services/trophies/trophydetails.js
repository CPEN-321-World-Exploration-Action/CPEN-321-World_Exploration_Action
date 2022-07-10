import * as Places from "../../data/external/googleplaces.external.js";
import { TrophyUser } from "../../data/db/trophy.db.js";
import { TrophyTrophy } from "../../data/db/trophy.db.js";

const MAX_TROPHIES = 10;

export async function getTrophiesUser(user_id, user_latitude, user_longitude){
    console.log(user_id, user_latitude, user_longitude)
    let uncollectedTrophies = await TrophyUser.getUserUncollectedTrophies(user_id);
    if (!uncollectedTrophies){
        uncollectedTrophies = [];
    }

    if ( uncollectedTrophies.length < MAX_TROPHIES){

        try{
            const numberOfNewTrophies = MAX_TROPHIES - uncollectedTrophies.length
            console.log(`Getting ${numberOfNewTrophies} new Trophies`)
            const locations = await Places.getPlaces(user_latitude, user_longitude, numberOfNewTrophies)
            
            if (!locations){
                console.log('No Locations found near User')
                return null // Handle null trophies in controllers.
            }
            // Convert locations into Trophies, and add them to the TrophyTrophy Database
            const newTrophyIds = await createManyTrophies(locations) //Can't rely on the returned list since some trophies might have been duplicated in which case this list will include key_error objects
            if (! newTrophyIds){
                return Error("Adding newly generated trophies to TrophyDB returned null.")
            }
            uncollectedTrophies.push(...newTrophyIds);
        
        }catch (error){
            console.log(error)
            return error
        }
    }
    // Update User's list of uncollected trophies
    await updateTrophyUser(user_id, {uncollectedTrophies})

    return getTrophyDetails(uncollectedTrophies)
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

export async function updateTrophyUser(user_id, body){
        // By default this will return the TrophyUser before being updated
        // It will update it correctly, just return the old task here.
        // Also validators aren't running - need options object
        return await TrophyUser.findOneAndUpdate({user_id:user_id}, body, {
            new: true, 
            runValidators: true
        })
}

export async function getTrophyDetails(ids){
    return await TrophyTrophy.find({trophy_id:{$in: ids}})
}

// Dev function
export async function getAllTrophies(){
    return await TrophyTrophy.find({})
}

export async function createTrophy(req){
    return await TrophyTrophy.create(req.body)
}

export async function createManyTrophies(locations){
    let trophies = [];
    for(let i=0; i< locations.length;i++){
        const {name, place_id:trophy_id, geometry, types:tags, rating, user_ratings_total} = locations[i]
        //console.log(name, trophy_id, geometry, types,  rating, user_ratings_total)

        // Ensure locations have a place_id
        if(trophy_id){
            // Geometry Object contains lat, lng location
            const {lat:latitude, lng:longitude} = geometry.location
            // Default quality is Bronze.
            let quality = "Bronze";
            if (rating && user_ratings_total){
                // Quality is the average of normalized rating and user_ratings, clamped at 1000. 
                const user_ratings_norm = Math.min(Number(user_ratings_total)/1000, 1)
                const quality_num = (Number(rating)/5 + Number(user_ratings_norm))/2
                switch(true){
                    case (quality_num < 0.33):
                        quality = "Bronze";
                        break;
                    case(quality_num < 0.66):
                        quality = "Silver";
                        break;
                    case(quality_num <= 1):
                        quality = "Gold";
                        break;
                    default:
                        break;
                }
            }
            console.log(tags)
            trophies.push({trophy_id, name, latitude, longitude, quality, tags})
        }
    }
    // Instead of returning the result of insertMany(), which may not always be the inserted trophies,
    // as in the case where a trophy already exists, we return the list of trophy ids.
    await TrophyTrophy.insertMany(trophies,{ ordered : false }, function (err, docs){
        //console.log(err)
    })
    let trophy_ids = trophies.map(trophy => trophy.trophy_id)
    return trophy_ids
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
