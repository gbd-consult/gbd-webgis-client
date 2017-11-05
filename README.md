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

## Configuration

There are two configuration files: build-time config and a run-time one. 
The build config is a module called `my_app.build.js`, it should export an object like this: 

```
module.exports = {
    lang: 'en',
    configURL: 'runtime-config-url',
    ui: '...',
    plugins: [...]
}
```

(see `examples/` for more).

The runtime config can any url on your server that returns a json.

## Build tasks

Each build task must be given your app build config (without extensions):

Create a production build in `/dist`:
```
APP=path/to/my_app npm run production
```
Build the fat dev version:
```
APP=path/to/my_app npm run dev
```
Run the dev server on `localhost:8080`:
```
APP=path/to/my_app npm run dev-server
```

## Other tasks

Build the docs in `./doc`
```
npm run doc
```

## Further reading

http://gbdclient.gbd-consult.de/doc