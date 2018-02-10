/**
 * @module plugins/editor
 *
 * @desc
 *
 * Feature editor
 *
 */

import React from 'react';
import Paper from 'material-ui/Paper';

import app from 'app';
import _ from 'lodash';
import ol from 'ol-all';

import mapUtil from 'map-util';

import Toolbar from './Toolbar';
import Layers from './Layers';
import Form from './Form';

const defaultFillColor = 'rgba(103,58,183,0.8)';
const defaultStrokeColor = 'rgba(244,67,54,0.8)';

const noLabel = __("gwc.plugin.gbd_digitize.noLabel");

function featureStyle(feature) {

    let layerStyle = feature.get('layerStyle') || {},
        props = feature.get('props') || {};

    let fill = new ol.style.Fill({
        color: layerStyle['fillColor'] || defaultFillColor,
    });

    let stroke = new ol.style.Stroke({
        color: layerStyle['strokeColor'] || defaultStrokeColor,
        width: 1
    });

    let s = {
        fill,
        stroke,
        image: new ol.style.Circle({
            fill,
            stroke,
            radius: 5
        })
    };

    if (app.get('editorShowLabels') && props.name) {
        s.text = new ol.style.Text({
            textAlign: 'center',
            text: props.name,
            offsetY: 10,
            fill: new ol.style.Fill({color: 'black'})
        });
    }

    return new ol.style.Style(s);
}

function createLayer(la) {

    let source = new ol.source.Vector();
    let wkt = new ol.format.WKT();

    la.features.forEach(f => {
        source.addFeature(new ol.Feature({
            featureID: f.id,
            layerID: la.id,
            geometry: wkt.readGeometry(f.props.wkt_geometry),
            props: f.props,
            layerStyle: la.style
        }));
    });

    let layer = new ol.layer.Vector({
        source,
        layerID: la.id,
        isEditor: true,
        isLayer: true,
        props: {
            name: la.name,
            attributes: la.attributes,
            style: la.style
        },
        style: featureStyle
    });

    app.map().attachLayer('editor', layer);
}

function parse(response) {

    if (!response || !response.layers)
        return;

    app.map().removeGroup('editor');
    response.layers.forEach(createLayer);
    update();
}

function update() {
    app.set({editorVersion: 1 + app.get('editorVersion')})
}

function post(cmd, data, done) {
    data = {
        ...data,
        plugin: 'digitize2',
        cmd
    };
    app.perform('gbdServerPost', {data, done});
}

function objectId(obj) {
    if (!obj)
        return 0;
    return obj.get('featureID') || obj.get('layerID');
}

function getObject(id) {
    let g = app.map().getGroup('editor');

    if (!id || !g)
        return null;

    let obj = null;

    g.getLayers().forEach(la => {
        if (la.get('layerID') === id) {
            obj = la;
        }
        la.getSource().getFeatures().forEach(f => {
            if (f.get('featureID') === id) {
                obj = f;
            }
        });
    });

    return obj;
}

function selectedLayer() {

    let obj = getObject(app.get('editorSelectedID'));

    if (obj && obj.get('featureID'))
        return getObject(obj.get('layerID'));

    return obj;
}

function setSelected(id) {
    let obj = getObject(id);

    if (obj) {
        app.set({editorSelectedID: objectId(obj)});
    } else {
        app.set({editorSelectedID: 0});
        app.perform('markerClear');

    }
}

function highlight(obj) {
    if (obj && obj.get('featureID')) {
        app.perform('markerMark', {features: [obj], pan: true, animate: true});
        _.debounce(() => app.perform('markerClear', {features: [obj]}), 1000)();
    }
}

function refresh(response, selectedID) {
    console.log(response)
    parse(response);
    setSelected(selectedID || app.get('editorSelectedID'));
    switch (app.get('mapMode')) {
        case 'editorModify':
            app.perform('editorModify')
            break;
        case 'editorDrawPoint':
            app.perform('editorDraw', {type: 'Point'});
            break;
        case 'editorDrawLineString':
            app.perform('editorDraw', {type: 'LineString'});
            break;
        case 'editorDrawPolygon':
            app.perform('editorDraw', {type: 'Polygon'})
            break;
        default:
            app.perform('mapDefaultMode');
    }
}


class Plugin extends app.Plugin {
    init() {

        app.set({
            editorVersion: 0,
            editorSelectedID: 0,
            editorShowLabels: true
        });

        post('list', {}, ({response}) => refresh(response));

        this.action('editorAddLayer', () => {
            app.perform('mapDefaultMode');
            let props = {
                style: {
                    fillColor: defaultFillColor,
                    strokeColor: defaultStrokeColor
                }
            };
            post('add_layer', {props}, ({response}) =>
                refresh(response, response.layerID));
        });

        this.action('editorUpdateLayer', ({layerID, props}) => {
            app.perform('mapDefaultMode');
            post('update_layer', {layerID, props}, ({response}) =>
                refresh(response, response.layerID));
        });

        this.action('editorUpdateFeature', ({featureID, props}) => {
            app.perform('mapDefaultMode');
            post('update_feature', {featureID, props}, ({response}) =>
                refresh(response, response.featureID));
        });

        this.action('editorSelect', ({object}) => {
            setSelected(objectId(object));
            highlight(object);
            app.perform('editorModify');
        });

        this.action('editorToggleVisible', ({object}) => {
            if (object.getVisible)
                object.setVisible(!object.getVisible());
            app.perform('mapDefaultMode');
            update();
        });

        this.action('editorToggleLabels', () => {
            app.set({editorShowLabels: !app.get('editorShowLabels')});
            post('list', {}, ({response}) => refresh(response));
        });

        this.action('editorModify', () => {
            app.perform('mapDefaultMode');

            let layer = selectedLayer();

            if (!layer)
                return;

            let source = layer.getSource(),
                intModify = new ol.interaction.Modify({source}),
                intSnap = new ol.interaction.Snap({source});

            intModify.on('modifyend', evt => this.modifyEnd(layer, evt));

            layer.setStyle(f => this.modifyStyleFunc(f));

            app.perform('mapSetMode', {
                name: 'editorModify',
                cursor: 'crosshair',
                interactions: [
                    'DragPan',
                    'MouseWheelZoom',
                    intModify,
                    intSnap,
                ],
                onLeave: () => layer.setStyle(featureStyle)
            });
        });


        this.action('editorDraw', ({type}) => {
            app.perform('mapDefaultMode');

            let layer = selectedLayer();

            if (!layer)
                return;

            let source = layer.getSource(),
                intDraw = new ol.interaction.Draw({source, type}),
                intSnap = new ol.interaction.Snap({source});

            intDraw.on('drawend', evt => this.drawEnd(layer, evt));

            app.perform('mapSetMode', {
                name: 'editorDraw' + type,
                cursor: 'crosshair',
                interactions: [
                    //'DragPan',
                    'MouseWheelZoom',
                    intDraw,
                    intSnap,
                ]
            });
        });

        this.action('editorDeleteFeature', ({featureID}) => {
            post('delete_feature', {featureID}, ({response}) => refresh(response));
        });

        this.action('editorDeleteLayer', ({layerID}) => {
            post('delete_layer', {layerID}, ({response}) => refresh(response));
        });

        this.action('search', async ({coordinate, geometry, done}) => {
            let opts = {
                layerFilter: layer => layer.get('isEditor') && layer.getVisible()
            };
            let m = app.map();
            let pixel = m.getPixelFromCoordinate(coordinate);
            let fs = [];

            app.map().forEachFeatureAtPixel(pixel, feature => fs.push(feature), opts);
            done(fs);
        })
    }


    modifyStyleFunc(feature) {
        let geom = feature.getGeometry(),
            g;

        if (geom instanceof ol.geom.Point)
            g = geom;
        else if (geom instanceof ol.geom.LineString)
            g = new ol.geom.MultiPoint(geom.getCoordinates());
        else if (geom instanceof ol.geom.Polygon)
            g = new ol.geom.MultiPoint(geom.getLinearRing(0).getCoordinates());
        else
            return featureStyle(feature);

        return [
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 3,
                    fill: new ol.style.Fill({
                        color: 'red'
                    }),
                }),
                geometry: g
            }),
            featureStyle(feature)
        ];
    }


    modifyEnd(layer, evt) {
        let features = [];
        let wkt = new ol.format.WKT();

        evt.features.forEach(f => {
            features.push({
                featureID: f.get('featureID'),
                props: {
                    wkt_geometry: wkt.writeGeometry(f.getGeometry())
                }
            });
        });

        post('update_features', {features});
    }

    drawEnd(layer, evt) {
        let wkt = new ol.format.WKT();
        let data = {
            layerID: layer.get('layerID'),
            props: {
                wkt_geometry: wkt.writeGeometry(evt.feature.getGeometry())
            }
        };
        post('add_feature', data, ({response}) => {
            refresh(response, response.featureID);
        });
    }
}

class Panel extends React.Component {
    render() {
        let selectedObject = getObject(app.get('editorSelectedID')),
            selectedLayer = selectedObject ? getObject(selectedObject.get('layerID')) : null,
            p = {...this.props, selectedObject, selectedLayer};

        return (
            <Paper style={app.theme('gwc.plugin.gbd_digitize.panel')}>
                <Layers {...p} />
                <Form {...p} />
                <Toolbar {...p} />
            </Paper>
        );
    }
}


export default {
    Plugin,
    Panel: app.connect(Panel, ['mapMode', 'editorSelectedID', 'editorVersion'])
}