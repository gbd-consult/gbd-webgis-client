// generic map events

import app from 'app';
import ol from 'ol-all';


export class Plugin extends app.Plugin {
    init() {

        app.set({
            mapScale: app.map().getScale(),
            mapRotation: 0
        });

        this.action('mapMode', ({name, cursor, interactions}) => {
            app.map().setMode(name, cursor, interactions)
            app.set({mapMode: name})
        });

        this.action('mapDefaultMode', () => {
            app.map().defaultMode();
            app.set({mapMode: ''})
        });

        this.action('mapSetScale', ({scale}) => {
            app.map().setScale(scale)
        });

        this.action('mapSetRotation', ({angle}) => {
            app.map().getView().setRotation(angle);
        });

        app.map().getView().on('change:resolution', () => {
            app.set({mapScale: app.map().getScale()});
        });

        app.map().getView().on('change:rotation', () => {
            app.set({mapRotation: app.map().getView().getRotation()});
        });
    }
}

export default {
    Plugin,
};
