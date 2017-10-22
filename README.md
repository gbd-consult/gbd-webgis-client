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

## Plugins

The client can be extended with plugins. A plugin is a module in `src/plugins`.  It must include the app code module (`app`) and export at least one class called `Plugin`:
```
import app from 'app';

export class Plugin extends app.Component {
...
}
```

For OpenLayers, include the `ol-all` module, for UI plugins, `React` and `material-ui`:

```
import React from 'react';
import IconButton from 'material-ui/IconButton';
...etc

import ol from `ol-all`;
import app from 'app';
```

Plugins can communicate via messaging, to send a message use `this.emit(message-name, ...args)`:

```
export class Plugin extends app.Component {
    onClick() {
        this.emit('draw.geometry', new ol.geom.Circle(...))
    }
    ...
}
```

To listen to a message, call `this.on(message-name, handler)` in `Plugin.componentDidMount`:

```
export class Plugin extends app.Component {
    componentDidMount() {
        this.on('draw.geometry', (geom) => this.doSomething(geom));
    }
    ...
}
```

The `app` module provides useful globals for plugins, e.g. `app.map()` is the current map and `app.config` is your app runtime config.

