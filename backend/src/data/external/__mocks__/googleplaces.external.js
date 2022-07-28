import { jest } from "@jest/globals";

//getPlaces(latitude, longitude, number, collected_ids)

export const getPlaces = jest.fn(async (latitude, longitude, number, collected_ids) => {
    // return locations.slice(0, number)

    return placeIDList;
});

export const placeIDList = [
    "ChIJcfSTmvR0hlQRHTBUcvS9EmE", // Rose Garden
    "ChIJUzqZj0oNhlQRSzlBeYd5v-0", // Wreck Beach
    "ChIJ28IkUs5zhlQRua6hLV7S3jY", // Granville Island
]