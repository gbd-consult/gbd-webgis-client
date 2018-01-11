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
        app.set({selectionShape: 'Box'});

        let fs = app.theme('gwc.plugin.selection.feature');
        this.style = mapUtil.makeStyle(fs);

        this.action('selectionStart', ({shape}) => {
            app.set({selectionShape: shape});
            this.start(shape);
        });

        this.action('selectionDrop', () => {
            this.drop();
        });
    }

    start(shape) {
        this.source = this.source || new ol.source.Vector({
            projection: app.config.str('map.crs.client')
        });

        app.map().serviceLayer(LAYER_KIND, () => new ol.layer.Vector({
            source: this.source,
            style: this.style
        }));

        let int = this.drawInteraction(shape);
        int.on('drawstart', (evt) => this.drawStart(evt));
        int.on('drawend', (evt) => this.drawEnd(evt));

        app.perform('mapSetMode', {
            name: 'selection',
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

    drawStart(evt) {
        this.source.clear();
    }

    drawEnd(evt) {
        app.set({selectionGeometry: evt.feature ? evt.feature.getGeometry() : null})
    }

    drop() {
        app.map().removeServiceLayer(LAYER_KIND);
        this.source = null;
        app.set({selectionGeometry: null});
        app.perform('mapDefaultMode');

    }
}


class Button extends React.Component {
    render() {
        let active = this.props.mapMode === 'selection';

        return (<div>
            <toolbar.Popover visible={active}>
                <toolbar.Button
                    secondary
                    active={this.props.selectionShape === 'Box'}
                    tooltip={__("gwc.plugin.selection.selectBox")}
                    onClick={() => app.perform('selectionStart', {shape: 'Box'})}
                    icon='crop_din'
                />
                <toolbar.Button
                    secondary
                    active={this.props.selectionShape === 'Polygon'}
                    tooltip={__("gwc.plugin.selection.selectPolygon")}
                    onClick={() => app.perform('selectionStart', {shape: 'Polygon'})}
                    icon='details'
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
                onClick={() => app.perform('selectionStart', {shape: this.props.selectionShape})}
                icon='crop_free'
            />}
        </div>);
    }
}


export default {
    Plugin,
    Button: app.connect(Button, ['mapMode', 'selectionShape'])
};
