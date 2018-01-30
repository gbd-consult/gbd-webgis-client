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

import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

const LAYER_KIND = 'selection';

class Plugin extends app.Plugin {
    init() {
        app.set({
            selectionMode: 'selectionDrawBoxMode',
            selectionGeometry: null,
            selectionGeometryWKT: null
        });

        let fs = app.theme('gwc.plugin.selection.feature');
        this.style = mapUtil.makeStyle(fs);

        this.action('selectionDrawBoxMode', () => {
            app.set({selectionMode: 'selectionDrawBoxMode'});
            this.drawMode('Box');
        });

        this.action('selectionDrawPolygonMode', () => {
            app.set({selectionMode: 'selectionDrawPolygonMode'});
            this.drawMode('Polygon');
        });

        this.action('selectionObjectMode', () => {
            app.set({selectionMode: 'selectionObjectMode'});
            this.objectMode();
        });

        this.action('selectionLastMode', () => {
            let mode = app.get('selectionMode') || 'selectionDrawBoxMode';
            app.perform(mode);
        });

        this.action('selectionDrop', () => {
            this.drop();
            app.perform('selectionLastMode');
        });

        this.action('selectionSelect', ({geometry}) => {
            let geoms = app.get('selectionGeometry') || [],
                wkt = new ol.format.WKT(),
                wnew = wkt.writeGeometry(geometry),
                out = [],
                found = false;

            geoms.forEach(g => {
                let w = wkt.writeGeometry(g);
                if (w === wnew) {
                    found = true;
                } else {
                    out.push(g);
                }
            });

            if (!found)
                out.push(geometry);

            this.source.clear();
            out.forEach(g => this.source.addFeature(new ol.Feature(g)));
            app.set({
                selectionGeometry: out,
                selectionGeometryWKT: out.map(g => wkt.writeGeometry(g)),
            });
        });
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

    drawMode(shape) {
        this.initLayer();

        let int = this.drawInteraction(shape);
        int.on('drawstart', (evt) => this.drawStart(evt));
        int.on('drawend', (evt) => this.drawEnd(evt));

        app.perform('mapSetMode', {
            name: 'selectionDraw' + shape,
            cursor: 'crosshair',
            interactions: [
                'DragPan',
                'MouseWheelZoom',
                'PinchZoom',
                int
            ]
        });
    }

    objectMode() {
        this.initLayer();

        let int = this.objectInteraction();

        app.perform('mapSetMode', {
            name: 'selectionObject',
            cursor: 'crosshair',
            interactions: [
                'DragPan',
                'MouseWheelZoom',
                'PinchZoom',
                int
            ]
        });
    }

    drawInteraction(shape) {
        if (shape === 'Polygon' || shape === 'Circle') {
            return new ol.interaction.Draw({
                type: shape,
                style: this.style,
                source: this.source
            });
        }
        if (shape === 'Box') {
            return new ol.interaction.Draw({
                type: 'Circle',
                geometryFunction: ol.interaction.Draw.createBox(),
                style: this.style,
                source: this.source
            });
        }
    }

    objectInteraction() {
        let dragged = false;

        return new ol.interaction.Pointer({
            handleDownEvent: evt => {
                dragged = false;
                return true;
            },
            handleUpEvent: evt => dragged ? null : this.objectEnd(evt),
            handleDragEvent: evt => dragged = true,
        });
    }


    drawStart(evt) {
        //this.source.clear();
    }

    drawEnd(evt) {
        if (evt.feature)
            app.perform('selectionSelect', {geometry: evt.feature.getGeometry()});
    }

    objectEnd(evt) {
        let foundGeom = null;

        app.perform('search', {
            coordinate: evt.coordinate,
            done: found => {
                if (foundGeom)
                    return;

                (found || []).some(feature => {
                    let geom = feature.getGeometry();
                    if (geom instanceof ol.geom.Polygon || geom instanceof ol.geom.MultiPolygon) {
                        foundGeom = geom;
                        return true;
                    }
                });

                if (foundGeom) {
                    app.perform('selectionSelect', {geometry: foundGeom});
                }
            }
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
                    active={mm === 'selectionDrawBox'}
                    tooltip={__("gwc.plugin.selection.selectBox")}
                    onClick={() => app.perform('selectionDrawBoxMode')}
                    icon='crop_din'
                />
                <toolbar.Button
                    secondary
                    active={mm === 'selectionDrawPolygon'}
                    tooltip={__("gwc.plugin.selection.selectPolygon")}
                    onClick={() => app.perform('selectionDrawPolygonwMode')}
                    icon='details'
                />
                <toolbar.Button
                    secondary
                    active={mm === 'selectionObject'}
                    tooltip={__("gwc.plugin.selection.selectObject")}
                    onClick={() => app.perform('selectionObjectMode')}
                    icon='arrow_upward'
                />
                <toolbar.Button
                    secondary
                    tooltip={__("gwc.plugin.selection.drop")}
                    onClick={() => app.perform('selectionDrop')}
                    icon='undo'
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
