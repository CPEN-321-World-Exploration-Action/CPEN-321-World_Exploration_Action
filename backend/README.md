# World Exploration Action - Backend

## How to Run

1. Put `firebase-service-account.json` in this folder
2. In the `.env` file, set `CLIENT_ID` to the Google Sign-in Web Client ID
3. In the `.env` file, set `GOOGLE_MAPS_API_KEY` to the Google Maps API key
4. For non-default MongoDB connection, set `dbURI` in the `.env` to the database URL
5. Make sure `npm` is installed
6. Run `npm install [--production]`
7. Then
   - Start: `npm start`
   - Develop (nodemon): `npm run dev`
   - Test: `npm test`

## Project Structure

- `src`
  - `routes` - mappings from URIs to controller functions
  - `controllers` - controllers that handle incoming requests and send response back to the caller
  - `middleware` - custom middleware, such as authentication
  - `services` - services layer
    - `users` - submodules inside the _Users_ main module
    - `trophies` - submodules inside the _Trophies_ main module
    - `photos` - submodules inside the _Photos_ main module
  - `data` - data layer
    - `db` - modules for interacting with databases
    - `external` - modules for interacting with external services
  - `utils` - utility functions

## Acknowledgements

### Dependencies

> TODO
