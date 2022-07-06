# World Exploration Action - Backend

## How to Run

1. Put `firebase-service-account.json` in this folder
2. Make sure `npm` is installed
3. `npm install [--production]`
4. `npm start`

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
