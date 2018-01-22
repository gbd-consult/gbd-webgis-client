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
import ol from 'ol-all';

import mapUtil from 'map-util';

import Toolbar from './Toolbar';
import Layers from './Layers';
import Form from './Form';

const defaultFillColor = 'rgba(103,58,183,0.8)';
const defaultStrokeColor = 'rgba(244,67,54,0.8)';

function layerStyle(la) {
    let fill = new ol.style.Fill({
        color: la.props['fillColor'] || defaultFillColor,
    });

    let stroke = new ol.style.Stroke({
        color: la.props['strokeColor'] || defaultStrokeColor,
        width: 1
    });

    return new ol.style.Style({
        fill,
        stroke,
        image: new ol.style.Circle({
            fill,
            stroke,
            radius: 5
        })
    });
}

function createLayer(la) {

    let source = new ol.source.Vector();

    la.features.forEach(f => {
        let wkt = new ol.format.WKT();
        source.addFeature(new ol.Feature({
            featureID: f.id,
            layerID: f.layer_id,
            geometry: wkt.readGeometry(f.props.geometry),
            props: f.props
        }));
    });

    let layer = new ol.layer.Vector({
        source,
        layerID: la.id,
        props: la.props,
        style: layerStyle(la)
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
        app.set({
            editorSelectedID: objectId(obj),
            editorForm: obj.get('props')
        });

    } else {
        app.set({
            editorSelectedID: 0,
            editorForm: {}
        });
    }

    if (obj && obj.get('featureID'))
        app.perform('markerMark', {features: [obj]});
    else
        app.perform('markerClear', {features: [obj]});
}

function reload(done) {
    post('list', {}, ({response}) => {
        parse(response);
        setSelected(app.get('editorSelectedID'));
        if (done)
            done();
    });
}

class Plugin extends app.Plugin {
    init() {

        app.set({
            editorVersion: 0,
            editorSelectedID: 1,
            editorForm: {}
        });

        reload();

        this.handleStyle = new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: 'red'
            }),
        });

        this.action('editorAddLayer', () => {
            app.perform('mapDefaultMode');

            let props = {
                fillColor: defaultFillColor,
                strokeColor: defaultStrokeColor
            };

            post('add_layer', {props}, ({response}) => {
                let newID = response.layer_id;
                reload(() => setSelected(newID));
            });
        });

        this.action('editorSelect', ({object}) => {
            setSelected(objectId(object));
            app.perform('editorModify');
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

            this.layerStyle = layer.getStyle();
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
                onLeave: () => layer.setStyle(this.layerStyle)
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

        this.action('editorFormSave', () => {
            let form = app.get('editorForm'),
                selected = getObject(app.get('editorSelectedID'));

            if (!selected)
                return;

            selected.set('props', form);
            let data = {
                id: objectId(selected),
                props: form
            };

            post('update', data, () => {
                reload(() => app.perform('editorModify'));
            });
        });

        this.action('editorDelete', () => {
            let selected = getObject(app.get('editorSelectedID'));

            if (!selected)
                return;

            let data = {
                id: objectId(selected),
            };

            post('delete', data, () => reload());


        });


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
            return this.layerStyle;

        return [
            new ol.style.Style({
                image: this.handleStyle,
                geometry: g
            }),
            this.layerStyle
        ];
    }


    modifyEnd(layer, evt) {
        let fs = [];

        evt.features.forEach(f => {
            let wkt = new ol.format.WKT();
            let props = f.get('props');
            props.geometry = wkt.writeGeometry(f.getGeometry());
            fs.push({
                id: f.get('featureID'),
                props
            });
        });

        post('update_many', {features: fs});
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
            reload();
        });
    }


}

class Panel extends React.Component {
    render() {
        let selected = getObject(app.get('editorSelectedID'));

        return (
            <Paper style={app.theme('gwc.plugin.gbd_digitize.panel')}>
                <Layers {...this.props}/>
                <Form selected={selected} {...this.props}/>
                <Toolbar {...this.props}/>
            </Paper>
        );
    }
}


export default {
    Plugin,
    Panel: app.connect(Panel, ['mapMode', 'editorSelectedID', 'editorVersion', 'editorForm'])
}