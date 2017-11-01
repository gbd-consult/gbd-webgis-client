# gbd-webgis-client

Map viewer based on React and OpenLayers.

## Requirements

Latest `node.js` and `npm`.

## Installation

Clone the repo and run `npm install`:

```
git clone https://github.com/gbd-consult/gbd-webgis-client
cd gbd-webgis-client
npm install
```

## Application config

First, create a config for your application (e.g. `my_app.config.js`). A config module must export an object like this

```
module.exports = {
    build: build-time configs, e.g. application UI
    runtime: run-time configs, e.g. map source and initial position
}
```
(see `exampleapp.config.js` for details).

## npm tasks

Each task must be given your app name.

Create a production build in `/dist`
```
APP=my_app npm run prod
```
Build the fat dev version:
```
APP=my_app npm run dev
```
Run the dev server on `localhost:8080`:
```
APP=my_app npm run dev-server
```

Build the docs in `./doc`
```
APP=my_app npm run doc
```

## further reading

http://gbdclient.gbd-consult.de/doc