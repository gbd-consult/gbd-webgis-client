/**
 * @module plugins/editor
 *
 * @desc
 *
 * Feature editor
 *
 */

import React from 'react';

import app from 'app';
import ol from 'ol-all';

import FeatureEditor from './FeatureEditor';
import LayerEditor from './LayerEditor';
import GeometryEditor from './GeometryEditor';

let _demoLayer;

async function demo() {
    _demoLayer = new ol.layer.Vector({
        name: 'Hamburg',
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,255,0.2)',
            }),
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 1
            }),
            minResolution: 0,
            maxResolution: 5
        })
    });

    let js = await app.http.get(app.config.str('sourceURL'));
    let fmt = new ol.format.GeoJSON();
    let fs = fmt.readFeatures(js);
    fs.forEach(f => {
        f.set('name',
            f.get('zaehler') + '/' + (f.get('gemarkungsnummer') || ''))
    });

    //fs = fs.slice(0, 5000);
    _demoLayer.getSource().addFeatures(fs);

    app.map().addLayer(_demoLayer);
    app.perform('editorStart', {
        layer: _demoLayer,
        options: {
            maxResolution: 1,
            geometryType: 'Polygon'
        }
    });
}


class Plugin extends app.Plugin {
    init() {
        setTimeout(demo, 10);

        this.gedit = null;

        this.action('editorStart', ({layer, options}) => {
            app.set({
                'sidebarVisible': true,
                'sidebarActivePanel': 'LayerEditor',
                'editorSelectedLayer': layer
            });

            options.onSelect = ({feature}) =>
                app.perform('editorFeatureSelected', {feature});

            options.onModify = ({features}) =>
                console.log('MODIFY', features);

            this.gedit = new GeometryEditor();
            this.gedit.start(layer, options);
        });

        this.action('editorStop', () => {
            if (this.gedit)
                this.gedit.stop();
        });

        this.action('editorSelectFeature', ({feature}) => {
            if (this.gedit)
                this.gedit.selectFeature(feature, true);
        });

        this.action('editorFeatureSelected', ({feature}) => {
            if (feature) {
                app.set({
                    'sidebarVisible': true,
                    'sidebarActivePanel': 'FeatureEditor',
                    'editorSelectedFeature': feature
                });
            } else {
                app.set({
                    'sidebarActivePanel': 'LayerEditor',
                });
            }
        });


    }
}

export default {
    Plugin,
    FeatureEditor,
    LayerEditor

};
