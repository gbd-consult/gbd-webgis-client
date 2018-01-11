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
import mapUtil from 'map-util';

class SimpleClickInteraction extends ol.interaction.Interaction {
    constructor(opts) {
        super({});
        this.lastEvent = null;
        this.handleClick = opts.handleClick;
        this.handleEvent = evt => {
            let t = this.lastEvent;
            this.lastEvent = evt.type;
            if (evt.type === 'pointerup' && t === 'pointerdown')
                return this.handleClick(evt);
            return true;
        }
    }
}


export default class GeometryEditor {
    start(layer, options) {
        this.layer = layer;
        this.maxResolution = options.maxResolution || 99;
        this.minResolution = options.minResolution || 0;
        this.geometryType = options.geometryType || 'Polygon';

        this.selectedFeature = null;

        this.onSelect = options.onSelect;
        this.onModify = options.onModify;

        this.layerStyle = layer.getStyle().clone();
        this.selectedStyle = options.selectedStyle || this.defaultSelectedStyle();

        this.layer.setStyle(this.styleFunc.bind(this));
        this.interactions = this.createInteractions();

        app.map().setMode('edit', 'cross', [
            new ol.interaction.MouseWheelZoom(),
            new ol.interaction.DragPan(),
            this.interactions.draw,
            this.interactions.select,
            this.interactions.modifyAll,
            this.interactions.snap,
        ]);
    }

    stop() {
        app.map().defaultMode();
    }

    defaultSelectedStyle() {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.2)',
            }),
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            })
        });
    }

    styleFunc(feature, resolution) {
        let baseStyle = feature === this.selectedFeature ? this.selectedStyle : this.layerStyle;
        if (resolution < this.minResolution || resolution > this.maxResolution)
            return baseStyle;

        if (this.selectedFeature && feature !== this.selectedFeature)
            return baseStyle;

        let handle = new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: 'red'
            }),
        });

        let ring = feature.getGeometry().getLinearRing(0);

        return [
            new ol.style.Style({
                image: handle,
                geometry: new ol.geom.MultiPoint(ring.getCoordinates())
            }),
            baseStyle
        ];
    }

    selectFeature(feature, pan = false) {
        if (this.selectedFeature)
            this.selectedFeature.changed();
        if (!feature || feature === this.selectedFeature) {
            this.selectedFeature = null;
        } else {
            this.selectedFeature = feature;
            this.selectedFeature.changed();
        }

        if (this.interactions.modifyFeature) {
            app.map().removeInteraction(this.interactions.modifyFeature);
            this.interactions.modifyFeature = null;
        }

        if (this.selectedFeature) {
            this.interactions.modifyAll.setActive(false);
            this.interactions.draw.setActive(false);
            this.interactions.snap.setActive(false);
            this.interactions.modifyFeature = new ol.interaction.Modify({
                features: new ol.Collection([this.selectedFeature]),
            });
            app.map().addInteraction(this.interactions.modifyFeature);
        } else {
            this.interactions.modifyAll.setActive(true);
            this.interactions.draw.setActive(true);
            this.interactions.snap.setActive(true);
        }

        if (pan && this.selectedFeature) {
            let center = ol.extent.getCenter(this.selectedFeature.getGeometry().getExtent());
            app.map().getView().setCenter(center);
        }

        this.onSelect({feature: this.selectedFeature});
    }

    createInteractions() {
        let source = this.layer.getSource(),
            ints = {};

        ints.draw = new ol.interaction.Draw({
            source,
            type: this.geometryType,
            condition: evt => this.canEdit() && this.featuresAtPixel(evt.pixel).length === 0
        });

        ints.modifyAll = new ol.interaction.Modify({
            source,
            condition: evt => this.canEdit()
        });

        ints.select = new SimpleClickInteraction({
            handleClick: evt => {
                let f = this.featuresAtPixel(evt.pixel);
                if (f.length) {
                    this.selectFeature(f[0])
                } else {
                    this.selectFeature(null)
                }
                return true;
            }
        });

        ints.snap = new ol.interaction.Snap({
            source,
            condition: evt => this.canEdit(),
        });

        return ints;
    }

    canEdit() {
        let res = app.map().getView().getResolution();
        return this.minResolution <= res && res <= this.maxResolution;
    }

    featuresAtPixel(pixel) {
        let fs = [];
        app.map().forEachFeatureAtPixel(pixel, f => void(fs.push(f)), {
            layerFilter: la => la === this.layer
        });
        return fs;
    }

}
