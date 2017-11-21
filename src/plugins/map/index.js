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

        let updateView = () => {
            app.set({
                mapScaleLevel: app.map().getScaleLevel(),
                mapResolution: app.map().getView().getResolution(),
                mapRotation: app.map().getView().getRotation()
            });
        };

        updateView();

        let updateMode = opts => {
            let s = {
                mapMode: app.map().getModeName(),
                overlayVisible: false
            }

            if(opts.overlay) {
                s.overlayVisible = true;
                s.overlayWidth = opts.overlay.width;
                s.overlayHeight = opts.overlay.height;
                s.overlayRatio = opts.overlay.ratio;
            }

            app.set(s);
        }

        this.action('mapSetMode', (opts) => {
            app.map().setMode(opts);
            updateMode(opts);
        });

        this.action('mapDefaultMode', () => {
            app.map().setDefaultMode();
            updateMode({});
        });

        this.action('mapPushMode', (opts) => {
            app.map().pushMode(opts);
        });

        this.action('mapPopMode', () => {
            app.map().popMode();
            updateMode({});
        });

        this.action('mapSetScaleLevel', ({level}) => {
            app.map().setScaleLevel(level)
        });

        this.action('mapSetRotation', ({angle}) => {
            app.map().getView().setRotation(angle);
        });

        app.map().getView().on('change:resolution', _.debounce(evt => {
            if (!evt.target.getAnimating())
                updateView();
        }, 500));

        app.map().getView().on('change:rotation', _.debounce(evt => {
            if (!evt.target.getAnimating())
                updateView();
        }, 500));
    }
}

export default {
    Plugin,
};
