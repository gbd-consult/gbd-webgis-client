import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

const LAYER_KIND = 'markerLayer';
const ANIMATION_DURATION = 500;

class Plugin extends app.Plugin {

    init() {
        this.style = mapUtil.makeStyle(app.theme('gwc.plugin.marker.feature'));
        this.pinOverlay = null;

        this.action('markerMark', ({features, zoom, pan, animate}) => {
            this.clear();
            if (this.mark(features)) {
                if (zoom)
                    this.zoom(animate);
                else if (pan)
                    this.pan(pan, animate);
            }
        });

        this.action('markerClear', () => this.clear());
    }

    mark(features) {
        let geoms = features
            .filter(Boolean)
            .map(f => f.getGeometry())
            .filter(Boolean);

        if (!geoms.length)
            return false;

        let la = app.map().serviceLayer(LAYER_KIND, () => new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: this.style
        }));

        la.getSource().addFeatures(geoms.map(g => new ol.Feature(g)));
        this.showPin();
        return true;
    }

    zoom(animate) {
        let ext = this.extent();

        if (ext) {
            app.map().getView().fit(
                ol.extent.buffer(ext, 100),
                {duration: animate ? ANIMATION_DURATION : 0}
            );
        }
    }

    pan(pan, animate) {
        let ext = this.extent();

        if (ext) {
            let center = ol.extent.getCenter(ext);

            if (_.isArray(pan)) {
                let px = app.map().getPixelFromCoordinate(center);
                ol.coordinate.add(px, pan);
                center = app.map().getCoordinateFromPixel(px);
            }

            if (animate)
                app.map().getView().animate({center, duration: ANIMATION_DURATION});
            else
                app.map().getView().setCenter({center});
        }
    }

    clear() {
        app.map().removeServiceLayer(LAYER_KIND);
        this.clearPin();
    }

    showPin() {
        this.clearPin();

        let position = this.pinPosition();
        if (!position)
            return;

        this.pinOverlay = new ol.Overlay({
            element: document.createElement('div'),
            position,
            offset: [0, 0],
            positioning: 'center-center',
            stopEvent: false
        });

        ReactDOM.render(
            <Pin/>,
            this.pinOverlay.getElement());

        app.map().addOverlay(this.pinOverlay);
    }

    clearPin() {
        if (this.pinOverlay)
            app.map().removeOverlay(this.pinOverlay);
        this.pinOverlay = null;
    }

    pinPosition() {
        // @TODO: workaround until we have jsts with proper centroid calculations

        let src = this.source();
        if (!src)
            return;

        let center = ol.extent.getCenter(src.getExtent()),
            polygons = src.getFeatures().filter(f => {
                let geom = f.getGeometry();
                return geom instanceof ol.geom.Polygon || geom instanceof ol.geom.MultiPolygon;
            });

        if (!polygons.length) {
            return center;
        }

        if (polygons.every(f => f.getGeometry().intersectsCoordinate(center))) {
            return center;
        }

        return polygons[0].getGeometry().getClosestPoint(center);
    }

    extent() {
        let src = this.source();
        if (src)
            return src.getExtent();
    }

    source() {
        let la = app.map().serviceLayer(LAYER_KIND);
        if (la && la.getSource().getFeatures().length)
            return la.getSource();
    }

}

class Pin extends React.Component {
    render() {
        return (
            <div
                className='material-icons'
                style={app.theme('gwc.plugin.marker.pin')}>place</div>
        );
    }
}

export default {
    Plugin
};
