import axios from "axios"

const key=process.env.GOOGLE_MAPS_API_KEY

export async function getPlaces(latitude, longitude, number, collected_ids){
    // collected_ids is an optional parameter to ensure a unique set of trophies.

    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=30000&type=point_of_interest&key=${key}`,
      headers: { }
    };
    console.log(config)
    
    try{
        const response = await axios(config)
        console.log(response.data.status)
    
        if (response.data.status == "ZERO_RESULTS"){
            console.log("Handle no results")
            return null;
        }else if (response.data.status != "OK"){
            return Error("Error Occured during Places API request.");
        }else{
            // Filter locations to ensure they have the place_id key.
            // TODO - this functionality may be better located in trophyFilter
            var locations = []
            if (collected_ids){
                locations = response.data.results.filter(location=> {return (location.place_id && !collected_ids.includes(location.place_id))})
            }else{
                locations = response.data.results.filter(location => {return location.place_id})
            }
            return locations.slice(0, number)
    }
    }catch (error){
        console.log(error)
    }
    
}
