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

function featureStyle(feature) {

    let layerProps = feature.get('layerProps') || {},
        props = feature.get('props') || {};

    let fill = new ol.style.Fill({
        color: layerProps['fillColor'] || defaultFillColor,
    });

    let stroke = new ol.style.Stroke({
        color: layerProps ['strokeColor'] || defaultStrokeColor,
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

    if (app.get('editorShowLabels') && props.label) {
        s.text = new ol.style.Text({
            textAlign: 'center',
            text: props.label,
            offsetY: 10,
            fill: new ol.style.Fill({color: 'black'})
        });
    }

    return new ol.style.Style(s);
}

function createLayer(la) {

    let source = new ol.source.Vector();

    la.features.forEach(f => {
        let wkt = new ol.format.WKT();
        source.addFeature(new ol.Feature({
            featureID: f.id,
            layerID: f.layer_id,
            geometry: wkt.readGeometry(f.props.geometry),
            props: f.props,
            layerProps: la.props
        }));
    });

    let layer = new ol.layer.Vector({
        source,
        layerID: la.id,
        isEditor: true,
        props: la.props,
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
                fillColor: defaultFillColor,
                strokeColor: defaultStrokeColor
            };

            post('add_layer', {props}, ({response}) =>
                refresh(response, response.layer_id));
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

        this.saveTimer = 0;
        this.saveDelay = 500;
        this.saveQueue = {};

        this.action('editorQueueSave', ({form, selected}) => {
            this.saveQueue[objectId(selected)] = form;
            selected.set('props', form);
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => app.perform('editorSave'), this.saveDelay);
            update();
        });

        this.action('editorSave', () => {
            let objects = Object.keys(this.saveQueue).map(id => ({
                id,
                props: this.saveQueue[id]
            }));

            this.saveQueue = {};

            if (objects.length)
                post('update_many', {objects}, ({response}) => refresh(response));
        });

        this.action('editorDelete', () => {
            let selected = getObject(app.get('editorSelectedID'));

            if (!selected)
                return;

            let data = {
                id: objectId(selected),
            };

            post('delete', data, ({response}) => refresh(response));
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
        let objects = [];
        let wkt = new ol.format.WKT();

        evt.features.forEach(f => {
            let props = f.get('props');
            props.geometry = wkt.writeGeometry(f.getGeometry());
            objects.push({
                id: f.get('featureID'),
                props
            });
        });

        post('update_many', {objects});
    }

    drawEnd(layer, evt) {
        let wkt = new ol.format.WKT();
        let data = {
            layer_id: layer.get('layerID'),
            props: {
                geometry: wkt.writeGeometry(evt.feature.getGeometry())
            }
        };
        post('add_feature', data, ({response}) => {
            evt.feature.set('featureID', response.feature_id);
            evt.feature.set('layerID', response.layer_id);
            evt.feature.set('props', {});
            refresh(response, response.feature_id);
        });
    }
}

class Panel extends React.Component {
    render() {
        let selected = getObject(app.get('editorSelectedID')),
            selectedLayer = selected ? getObject(selected.get('layerID')) : null,
            p = {...this.props, selected, selectedLayer};

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