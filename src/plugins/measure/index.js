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
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';

import {blue500, red500} from 'material-ui/styles/colors';


import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

import './index.sass'


const LAYER_KIND = 'measure';

class Plugin extends app.Plugin {
    init() {

        this.listeners = {};
        this.overlays = {};
        this.interactions = {};

        this.style = mapUtil.makeStyle({
            fill: {
                color: 'rgba(255,255,255,0.5)'
            },
            stroke: {
                color: 'red',
                lineDash: [6, 6],
                width: 2
            }
        });

        this.handleImage = new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: 'red'
            }),
        });

        this.subscribe('mapMode', (newMode) => {
            if (newMode !== 'measure') {
                this.reset();
            }
        });

        this.action('measureToggle', () => {
            if (app.get('mapMode') === 'measure')
                return app.perform('mapDefaultMode');
            this.start();
            app.perform('measureMode', {mode: 'distance'});
        });

        this.action('measureMode', ({mode}) => {
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

        app.perform('mapMode', {
            name: 'measure',
            cursor: 'crosshair',
            interactions: [
                new ol.interaction.DragPan(),
                new ol.interaction.MouseWheelZoom(),
                this.interactions.modify,
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
            return this.style;

        return [
            new ol.style.Style({
                image: this.handleImage,
                geometry: new ol.geom.MultiPoint(bounds.getCoordinates())
            }),
            this.style
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
            content,
            coord;

        if (geom instanceof ol.geom.Polygon) {
            content = this.formatArea(ol.Sphere.getArea(geom, {
                projection: app.config.str('map.crs.client')
            }));
            coord = geom.getInteriorPoint().getCoordinates();
        }

        if (geom instanceof ol.geom.LineString) {
            content = this.formatDistance(ol.Sphere.getLength(geom, {
                projection: app.config.str('map.crs.client')
            }));
            coord = geom.getLastCoordinate();
        }

        let uid = ol.getUid(feature);
        let overlay = this.overlays[uid] || (
            this.overlays[uid] = this.createTooltipOverlay());

        overlay.getElement().style.display = content ? 'block' : 'none';
        overlay.getElement().innerHTML = content;
        overlay.setPosition(coord);
    }

    createTooltipOverlay() {
        let elem = document.createElement('div');
        elem.className = 'measure-tooltip';
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

    formatDistance(n) {
        if (n >= 1e3)
            return (n / 1e3).toFixed(2) + '&nbsp;km';
        if (n > 1)
            return (n).toFixed(0) + '&nbsp;m';
        return '';
    }

    formatArea(n) {
        if (n >= 1e5)
            return (n / 1e6).toFixed(2) + '&nbsp;km<sup>2</sup>';
        if (n > 1)
            return (n).toFixed(0) + '&nbsp;m<sup>2</sup>';
        return '';
    }
}


class Button extends React.Component {

    button(active) {
        return (
            <IconButton
                tooltip={__("buttonTooltip")}
                onClick={() => app.perform('measureToggle')}
            >
                <FontIcon
                    color={active ? red500 : blue500}
                    className="material-icons">straighten</FontIcon>
            </IconButton>
        );
    }

    toolbar(mode) {
        return (
            <div style={{
                position: 'fixed',
                right: 0,
                bottom: 150
            }}>
                <Paper>
                    <IconButton
                        tooltip={__("distanceTooltip")}
                        onClick={() => app.perform('measureMode', {mode: 'distance'})}
                    >
                        <FontIcon
                            color={mode === 'distance' ? red500 : blue500}
                            className="material-icons">linear_scale</FontIcon>
                    </IconButton>

                    <IconButton
                        tooltip={__("areaTooltip")}
                        onClick={() => app.perform('measureMode', {mode: 'area'})}
                    >
                        <FontIcon
                            color={mode === 'area' ? red500 : blue500}
                            className="material-icons">texture</FontIcon>
                    </IconButton>

                    <IconButton
                        tooltip={__("cancelTooltip")}
                        onClick={() => app.perform('measureToggle')}
                    >
                        <FontIcon className="material-icons">close</FontIcon>
                    </IconButton>


                </Paper>
            </div>



        )

    }

    render() {
        let active = this.props.mapMode === 'measure';

        if (!active)
            return this.button(false);

        return (
            <div>
                {this.toolbar(this.props.measureMode)}
                {this.button(true)}
            </div>
        )
    }
}


export default {
    Plugin,
    Button: app.connect(Button, ['mapMode', 'measureMode'])
};
