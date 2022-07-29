import { jest } from "@jest/globals";

//getPlaces(latitude, longitude, number, collected_ids)

export const getPlaces = jest.fn(async (latitude, longitude, number, collected_ids) => {
    // return locations.slice(0, number)
    if (latitude + longitude >= 500) {
        return [];
    }
    else {
        return placeIDList;
    }
});


export const placeIDList = [{
    geometry: {
        location: {
            lat: 49.2694, lng: -123.2565
        }
    },
    name: 'Rose Garden',
    place_id: 'ChIJcfSTmvR0hlQRHTBUcvS9EmE',
    rating: 4.2,
    types: [
        'park',
        'tourist_attraction',
        'point_of_interest',
        'establishment'
    ],
    user_ratings_total: 38,
},
{
    geometry: {
        location: {
            lat: 49.2622, lng: -123.2615
        }
    },
    name: 'Wreck_Beach',
    place_id: 'ChIJUzqZj0oNhlQRSzlBeYd5v-0',
    rating: 5,
    types: [
        'park',
        'tourist_attraction',
        'point_of_interest',
        'establishment'
    ],
    user_ratings_total: 8,
},
{
    geometry: {
        location: {
            lat: 49.2622, lng: -123.2615
        }
    },
    name: 'Granville_Island',
    place_id: 'ChIJ28IkUs5zhlQRua6hLV7S3jY',
    rating: 4.5,
    types: ['park', 'point_of_interest', 'establishment'],
    user_ratings_total: 11
}];


/*
export const placeIDList = [
    "ChIJcfSTmvR0hlQRHTBUcvS9EmE", // Rose Garden
    "ChIJUzqZj0oNhlQRSzlBeYd5v-0", // Wreck Beach
    "ChIJ28IkUs5zhlQRua6hLV7S3jY", // Granville Island
]
*/