/**
 * @module plugins/map
 *
 * @desc
 *
 * System plugin that acts as a bridge between the map (TMap) and the redux store.
 *
 */


import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';


export class Plugin extends app.Plugin {
    init() {

        app.set({
            mapScaleLevel: app.map().getScaleLevel(),
            mapRotation: 0
        });

        this.action('mapSetMode', (opts) => {
            app.map().setMode(opts);
            app.set({mapMode: app.map().getModeName()});
        });

        this.action('mapDefaultMode', () => {
            app.map().setDefaultMode();
            app.set({mapMode: app.map().getModeName()});
        });

        this.action('mapPushMode', (opts) => {
            app.map().pushMode(opts);
        });

        this.action('mapPopMode', () => {
            app.map().popMode();
            app.set({mapMode: app.map().getModeName()});
        });

        this.action('mapSetScaleLevel', ({level}) => {
            app.map().setScaleLevel(level)
        });

        this.action('mapSetRotation', ({angle}) => {
            app.map().getView().setRotation(angle);
        });

        app.map().getView().on('change:resolution', _.debounce(evt => {
            if (!evt.target.getAnimating())
                app.set({mapScaleLevel: app.map().getScaleLevel()});
        }, 500));

        app.map().getView().on('change:rotation', _.debounce(evt => {
            if (!evt.target.getAnimating())
                app.set({mapRotation: app.map().getView().getRotation()});
        }, 500));
    }
}

export default {
    Plugin,
};
