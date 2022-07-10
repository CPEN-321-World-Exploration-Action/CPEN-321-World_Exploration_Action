import axios from "axios"

const key=process.env.GOOGLE_MAPS_API_KEY

export async function getPlaces(latitude, longitude, number){
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=30000&key=${key}`,
      headers: { }
    };
    
    try{
        const response = await axios(config)
        console.log(response.data.status)
    
        if (response.data.status == "ZERO_RESULTS"){
            console.log("Handle no results")
            return null
        }else{
            const locations = response.data.results.slice(0, number)
            return locations;
    }
    }catch (error){
        console.log(error)
    }
    
}
