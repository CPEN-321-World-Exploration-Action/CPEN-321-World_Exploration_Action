import * as Places from "../../data/external/googleplaces.external.js";
import { TrophyUser } from "../../data/db/trophy.db.js";
import { TrophyTrophy } from "../../data/db/trophy.db.js";

const MAX_TROPHIES = 10;
const MIN_DISTANCE_METERS = 30000; // Enforce that the closest trophy must be closer than 30km

export async function getTrophiesUser(user_id, user_latitude, user_longitude){
    console.log(user_id, user_latitude, user_longitude)

    // TODO: I think these two db queries should be merged into one
    let uncollectedTrophyIDs = await TrophyUser.getUserUncollectedTrophyIDs(user_id);
    // Require list of collected trophies to ensure we don't serve already collected trophies in Places.
    let collectedTrophyIDs = await TrophyUser.getUserCollectedTrophyIDs(user_id);  


    console.log(uncollectedTrophyIDs, collectedTrophyIDs)

    if (!uncollectedTrophyIDs){
        uncollectedTrophyIDs = [];
    }else{
        const minTrophyDistance = await computeMinTrophyDistance(user_latitude, user_longitude, uncollectedTrophyIDs);
        if (minTrophyDistance > MIN_DISTANCE_METERS){
            console.log(`All User Uncollected Trophies exceed ${MIN_DISTANCE_METERS} meters from the User. Regenerating Trophies for new Location`)
            uncollectedTrophyIDs= []; // Collect an entire new set of trophies
        }
    }

    if ( uncollectedTrophyIDs.length < MAX_TROPHIES){

        try{
            const numberOfNewTrophies = MAX_TROPHIES - uncollectedTrophyIDs.length
            console.log(`Getting ${numberOfNewTrophies} new Trophies`)
            const locations = await Places.getPlaces(user_latitude, user_longitude, numberOfNewTrophies, collectedTrophyIDs)
            
            if (!locations){
                console.log('No Locations found near User')
                return null // Handle null trophies in controllers.
            }
            // Convert locations into Trophies, and add them to the TrophyTrophy Database
            const newTrophyIds = await createManyTrophies(locations) //Can't rely on the returned list since some trophies might have been duplicated in which case this list will include key_error objects
            if (! newTrophyIds){
                return Error("Adding newly generated trophies to TrophyDB returned null.")
            }
            uncollectedTrophyIDs.push(...newTrophyIds);
        
        }catch (error){
            console.log(error)
            return error
        }
    }
    // Update User's list of uncollected trophies
    await updateTrophyUser(user_id, {uncollectedTrophyIDs})
    
    let uncollectedTrophies = await getTrophyDetails(uncollectedTrophyIDs);
    console.log(uncollectedTrophies)
    //  Add parameter describing if trophy is collected or not
    uncollectedTrophies = uncollectedTrophies.map((trophy) => ( {...trophy._doc, collected: false}));
    console.log(uncollectedTrophies)
    // Get User's list of collected trophies
    let collectedTrophies = await getTrophyDetails(collectedTrophyIDs);

    if (!collectedTrophies){
        return uncollectedTrophies
    }else{
        collectedTrophies = collectedTrophies.map((trophy) => ( {...trophy._doc, collected: true}));
        return uncollectedTrophies.concat(collectedTrophies);
    }
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

export async function getAllTrophiesUsers(){
    return await TrophyUser.find({})
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

export async function computeMinTrophyDistance(user_latitude, user_longitude, trophyIds){

    const trophies = await getTrophyDetails(trophyIds);

    if (!trophies){
        return Error('Trophy Ids are not valid');
    }

    var minDist = Number.MAX_VALUE;
    for(let i = 0; i < trophies.length; i++){
        const {latitude, longitude} = trophies[i]
        minDist = Math.min(minDist, haversineDistance(user_latitude, user_longitude, latitude, longitude))
    }
    console.log(minDist);
    return minDist;
}  

export function haversineDistance(lat1, lon1, lat2, lon2){
    // The Haversine formula computes the great circle distance between two points

    const R = 6.371e6; // metres - radius of Earth
    const phi_1 = lat1 * Math.PI/180; // φ, λ in radians
    const phi_2 = lat2 * Math.PI/180;
    const dphi = (lat2-lat1) * Math.PI/180;
    const dlambda = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(dphi/2) * Math.sin(dphi/2) +
            Math.cos(phi_1) * Math.cos(phi_2) *
            Math.sin(dlambda/2) * Math.sin(dlambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    console.log(d)
    return d
}

export async function getUserCollectedTrophy(userID) {
    return TrophyUser.getTrophyCollected(userID);
}

export async function getUserUncollectedTrophy(userID) {
    return TrophyUser.getUserUncollectedTrophyIDs(userID);
}