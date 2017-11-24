/**
 * @module plugins/measure
 *
 * @desc
 *
 * Provides measure distance and measure area buttons.
 *
 */

// roughly based on https://openlayers.org/en/latest/examples/measure.html

import React from 'react';
import ReactDOM from 'react-dom';

import * as toolbar from 'components/Toolbar';

import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

const LAYER_KIND = 'measure';

class Plugin extends app.Plugin {
    init() {

        this.listeners = {};
        this.overlays = {};
        this.interactions = {};

        let fs = app.theme('gwc.plugin.measure.feature');

        this.featureStyle = mapUtil.makeStyle(fs);

        this.handleImage = new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: fs.stroke.color
            }),
        });

        this.subscribe('mapMode', (newMode) => {
            if (newMode !== 'measure') {
                this.reset();
            }
        });

        this.action('measureModeToggle', () => {
            if (app.get('mapMode') === 'measure')
                return app.perform('mapDefaultMode');
            this.start();
            app.perform('measureMode', {mode: 'distance'});
        });

        this.action('measureMode', ({mode}) => {
            this.start();
            this.interactions.drawString.setActive(mode === 'distance');
            this.interactions.drawPolygon.setActive(mode === 'area');
            app.set({measureMode: mode})
        });

    }

    start() {
        let la = app.map().serviceLayer(LAYER_KIND, () => new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: this.styleFunc.bind(this)
        }));

        if (!this.interactions.drawString) {
            this.interactions.drawString = this.drawInteraction(la, 'LineString');
        }

        if (!this.interactions.drawPolygon) {
            this.interactions.drawPolygon = this.drawInteraction(la, 'Polygon');
        }

        if (!this.interactions.modify) {
            this.interactions.modify = new ol.interaction.Modify({
                source: la.getSource(),
                style: this.styleFunc.bind(this)
            });
        }

        app.perform('mapSetMode', {
            name: 'measure',
            cursor: 'crosshair',
            interactions: [
                'DragPan',
                'MouseWheelZoom',
                'PinchZoom',
                //this.interactions.modify,
                this.interactions.drawString,
                this.interactions.drawPolygon,
            ]
        });


    }

    drawInteraction(layer, type) {
        let draw = new ol.interaction.Draw({
            type,
            source: layer.getSource(),
            style: this.styleFunc.bind(this)
        });

        draw.on('drawstart', (evt) => {
            this.addWatch(evt.feature);
        });

        return draw;
    }


    styleFunc(feature, resolution) {
        let geom = feature.getGeometry(),
            bounds;

        if (geom instanceof ol.geom.Polygon)
            bounds = geom.getLinearRing(0);
        if (geom instanceof ol.geom.LineString)
            bounds = geom;

        if (!bounds)
            return this.featureStyle;

        return [
            new ol.style.Style({
                image: this.handleImage,
                geometry: new ol.geom.MultiPoint(bounds.getCoordinates())
            }),
            this.featureStyle
        ];
    }

    reset() {
        this.removeAllWatches();
        this.interactions = {};
        app.map().removeServiceLayer(LAYER_KIND);
    }


    addWatch(feature) {
        let uid = ol.getUid(feature);

        if (this.listeners[uid]) {
            return;
        }

        this.updateTooltip(feature);
        this.listeners[uid] = feature.getGeometry().on('change', () => this.updateTooltip(feature));
    }

    removeWatch(feature) {
        let uid = ol.getUid(feature);

        if (this.listeners[uid]) {
            ol.Observable.unByKey(this.listeners[uid]);
            delete this.listeners[uid];
        }

        if (this.overlays[uid]) {
            this.removeTooltipOverlay(this.overlays[uid]);
            delete this.overlays[uid];
        }
    }

    removeAllWatches() {
        Object.keys(this.listeners).forEach(uid =>
            ol.Observable.unByKey(this.listeners[uid]));
        Object.keys(this.overlays).forEach(uid =>
            this.removeTooltipOverlay(this.overlays[uid]));
        this.listeners = {};
        this.overlays = {};
    }

    updateTooltip(feature) {
        let geom = feature.getGeometry(),
            projection = app.config.str('map.crs.client'),
            type,
            value,
            coord;

        if (geom instanceof ol.geom.Polygon) {
            type = 'area';
            value = ol.Sphere.getArea(geom, {projection});
            coord = geom.getInteriorPoint().getCoordinates();
        }

        if (geom instanceof ol.geom.LineString) {
            type = 'distance';
            value = ol.Sphere.getLength(geom, {projection});
            coord = geom.getLastCoordinate();
        }

        let uid = ol.getUid(feature);
        let overlay = this.overlays[uid] || (
            this.overlays[uid] = this.createTooltipOverlay());

        ReactDOM.render(
            <Tooltip type={type} value={value}/>,
            overlay.getElement());

        overlay.setPosition(coord);
    }

    createTooltipOverlay() {
        let elem = document.createElement('div');
        let overlay = new ol.Overlay({
            element: elem,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        app.map().addOverlay(overlay);
        return overlay;
    }

    removeTooltipOverlay(overlay) {
        let elem = overlay.getElement();
        if (elem && elem.parentNode)
            elem.parentNode.removeChild(elem);
        app.map().removeOverlay(overlay);
    }
}


class Tooltip extends React.Component {
    content(type, value) {
        if (type === 'distance') {
            if (value >= 1e3)
                return <span>{(value / 1e3).toFixed(2)}&nbsp;km</span>;
            if (value > 1)
                return <span>{(value).toFixed(0)}&nbsp;m</span>;
        }

        if (type === 'area') {
            if (value >= 1e5)
                return <span>{(value / 1e6).toFixed(2)}&nbsp;km<sup>2</sup></span>;
            if (value > 1)
                return <span>{(value).toFixed(0)}&nbsp;m<sup>2</sup></span>;
        }
    }

    render() {
        let s = this.content(this.props.type, this.props.value);

        if(!s)
            return null;

        return (
            <div style={app.theme('gwc.plugin.measure.tooltip')}>{s}</div>
        );
    }
}

class Button extends React.Component {
    render() {
        let active = this.props.mapMode === 'measure';

        return (<div>
            <toolbar.Popover visible={active}>
                <toolbar.Button
                    secondary
                    active={this.props.measureMode === 'distance'}
                    tooltip={__("distanceTooltip")}
                    onClick={() => app.perform('measureMode', {mode: 'distance'})}
                    icon='linear_scale'
                />
                <toolbar.Button
                    secondary
                    active={this.props.measureMode === 'area'}
                    tooltip={__("areaTooltip")}
                    onClick={() => app.perform('measureMode', {mode: 'area'})}
                    icon='texture'
                />
                <toolbar.Button
                    secondary
                    tooltip={__("cancelTooltip")}
                    onClick={() => app.perform('measureModeToggle')}
                    icon='close'
                />
            </toolbar.Popover>
            {!active && <toolbar.Button
                {...this.props}
                active={false}
                tooltip={__("buttonTooltip")}
                onClick={() => app.perform('measureModeToggle')}
                icon='straighten'
            />}
        </div>);
    }
}


export default {
    Plugin,
    Button: app.connect(Button, ['mapMode', 'measureMode'])
};
