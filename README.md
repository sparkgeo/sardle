# Urb**le**

We forked [wordle](https://github.com/teuteuf/worldle) then made it harder and less coherent.

This is a May 2022 hackathon project by Team Defiant. The code is far from perfect and should not be used as an example of best practices.

## Data
- Cities - Natural Earth
- Streets - OpenStreetMap
- Weather - weatherdbi
- Satellite imagery - Mapbox

## Getting started
1. Start an instance of [this API](https://github.com/sparkgeo/defiant-hack-may-2022/tree/main/street_api) locally (follow the steps in the repo).
2. `git clone git@github.com:sparkgeo/urble.git`
3. `cd urble`
4. Create a `.env.local` file and add your mapbox token:
  ```
  REACT_APP_MAPBOX_TOKEN=<your token>
  ``` 
5. `npm i`
6. `npm start`
