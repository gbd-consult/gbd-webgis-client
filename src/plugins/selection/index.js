/**
 * @module plugins/selection
 *
 * @desc
 *
 * Selection tools.
 *
 */

import React from 'react';

import * as toolbar from 'components/Toolbar';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

const LAYER_KIND = 'selection';
const POINT_TOLERANCE = 2;

class Plugin extends app.Plugin {
    init() {
        app.set({
            selectionMode: 'selectionQueryPoint',
            selectionGeometry: null,
            selectionGeometryWKT: null
        });

        let fs = app.theme('gwc.plugin.selection.feature');
        this.style = mapUtil.makeStyle(fs);

        let sel = app.config.object('selection');
        if (sel)
            this.restoreSelection(sel);

        this.action('selectionMode', ({mode}) => {
            app.set({selectionMode: mode});
            switch (mode) {
                case 'selectionQueryPoint':
                    this.startQueryPoint();
                    break;
                case 'selectionQueryPolygon':
                    this.startDraw(mode, 'Polygon', 'selectionQuery');
                    break;
                case 'selectionDrawPolygon':
                    this.startDraw(mode, 'Polygon', 'selectionSelect');
                    break;
            }
        });

        this.action('selectionLastMode', () => {
            let mode = app.get('selectionMode') || 'selectionDrawBoxMode';
            app.perform('selectionMode', {mode});
        });

        this.action('selectionDrop', () => {
            this.drop();
            app.perform('selectionLastMode');
        });

        this.action('selectionQuery', ({geometry}) => {
            app.perform('gbdServerPost', {
                data: this.prepareQuery(geometry),
                done: ({response, error}) => {
                    this.addGeometriesWKT(response.features.map(f => f.wkt));
                }
            });
        });

        this.action('selectionSelect', ({geometry}) => {
            this.addGeometries([geometry])
        });
    }

    restoreSelection(sel) {
        this.initLayer();

        if (sel.wkt) {
            let wkt = new ol.format.WKT();
            let geoms = sel.wkt.map(w => wkt.readGeometry(w));
            this.addGeometries(geoms);
            setTimeout(() => app.perform('markerMark', {
                features: geoms.map(g => new ol.Feature(g)),
                pan: true,
                zoom: true,
                animate: true,
                flash: true
            }), sel.delay || 2000)
        }
    }

    addGeometries(geoms) {
        let wkt = new ol.format.WKT();
        this.addGeometriesWKT(geoms.map(g => wkt.writeGeometry(g)));
    }

    addGeometriesWKT(wkts) {
        let wkt = new ol.format.WKT();

        let wktCurr = app.get('selectionGeometryWKT') || [],
            wktNew = [],
            geomNew;

        wktCurr.forEach(g => {
            let i = wkts.indexOf(g);
            if (i >= 0) {
                wkts[i] = null;
            } else {
                wktNew.push(g);
            }
        });

        wktNew = wktNew.concat(wkts.filter(Boolean));
        geomNew = wktNew.map(w => wkt.readGeometry(w));

        this.source.clear();
        geomNew.forEach(g => this.source.addFeature(new ol.Feature(g)));

        app.set({
            selectionGeometry: geomNew,
            selectionGeometryWKT: wktNew,
        });
    }

    prepareQuery(geometry) {
        let mapName = '',
            wmsLayers = [],
            editorLayers = [];

        wmsLayers = app.map().getLayerRoot().collect(la => {
            if (la.isVisible() && la.wmsName && _.isEmpty(la.layers)) {
                let m = _.get(la, 'config.params.map');
                if (m)
                    mapName = m;
                return la.getTitle();
            }
        });

        let g = app.map().getGroup('editor');
        if (g) {
            g.getLayers().forEach(la => {
                if (la.getVisible())
                    editorLayers.push((la.get('props') || {}).name);
            })
        }

        let wkt = new ol.format.WKT();

        return {
            plugin: 'selection2',
            cmd: 'search',
            bounds: wkt.writeGeometry(geometry),
            map: mapName,
            layers: editorLayers.concat(wmsLayers)
        };
    }

    initLayer() {
        this.source = this.source || new ol.source.Vector({
            projection: app.config.str('map.crs.client')
        });

        app.map().serviceLayer(LAYER_KIND, () => new ol.layer.Vector({
            source: this.source,
            style: this.style
        }));
    }

    startQueryPoint() {
        this.initLayer();

        let dragged = false;

        let int = new ol.interaction.Pointer({
            handleDownEvent: evt => {
                dragged = false;
                return true;
            },
            handleUpEvent: evt => {
                if (!dragged) {
                    let p = evt.coordinate,
                        poly = ol.geom.Polygon.fromExtent([
                            p[0] - POINT_TOLERANCE,
                            p[1] - POINT_TOLERANCE,
                            p[0] + POINT_TOLERANCE,
                            p[1] + POINT_TOLERANCE,
                        ]);
                    app.perform('selectionQuery', {geometry: poly});
                }
            },
            handleDragEvent: evt => dragged = true,
        });

        app.perform('mapSetMode', {
            name: 'selectionQueryPoint',
            cursor: 'crosshair',
            interactions: [
                'DragPan',
                'MouseWheelZoom',
                'PinchZoom',
                int
            ]
        });
    }

    startDraw(mode, shape, action) {
        this.initLayer();

        let int = new ol.interaction.Draw({
            type: shape,
            style: this.style,
            source: this.source
        });

        int.on('drawend', evt => {
            if (evt.feature)
                app.perform(action, {geometry: evt.feature.getGeometry()});
        });

        app.perform('mapSetMode', {
            name: mode,
            cursor: 'crosshair',
            interactions: [
                'DragPan',
                'MouseWheelZoom',
                'PinchZoom',
                int
            ]
        });
    }

    drop() {
        app.map().removeServiceLayer(LAYER_KIND);
        this.source = null;
        app.set({
            selectionGeometry: null,
            selectionGeometryWKT: null
        });
    }
}


class Button extends React.Component {
    render() {
        let mm = this.props.mapMode,
            active = String(mm).match(/^selection/);

        return (<div>
            <toolbar.Popover visible={active}>
                <toolbar.Button
                    secondary
                    active={mm === 'selectionQueryPoint'}
                    tooltip={__("gwc.plugin.selection.queryPoint")}
                    onClick={() => app.perform('selectionMode', {mode: 'selectionQueryPoint'})}
                    icon='flare'
                />
                <toolbar.Button
                    secondary
                    active={mm === 'selectionQueryPolygon'}
                    tooltip={__("gwc.plugin.selection.queryPolygon")}
                    onClick={() => app.perform('selectionMode', {mode: 'selectionQueryPolygon'})}
                    icon='filter_center_focus'
                />
                <toolbar.Button
                    secondary
                    active={mm === 'selectionDrawPolygon'}
                    tooltip={__("gwc.plugin.selection.drawPolygon")}
                    onClick={() => app.perform('selectionMode', {mode: 'selectionDrawPolygon'})}
                    icon='crop_free'
                />
                <toolbar.Button
                    secondary
                    tooltip={__("gwc.plugin.selection.drop")}
                    onClick={() => app.perform('selectionDrop')}
                    icon='block'
                />
                <toolbar.Button
                    secondary
                    tooltip={__("gwc.plugin.selection.cancel")}
                    onClick={() => app.perform('mapDefaultMode')}
                    icon='close'
                />
            </toolbar.Popover>
            {!active && <toolbar.Button
                {...this.props}
                active={false}
                tooltip={__("gwc.plugin.selection.select")}
                onClick={() => app.perform('selectionLastMode')}
                icon='crop_free'
            />}
        </div>);
    }
}


export default {
    Plugin,
    Button: app.connect(Button, ['mapMode', 'selectionShape'])
};
