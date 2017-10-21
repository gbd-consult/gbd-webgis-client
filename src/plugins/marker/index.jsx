import React from 'react';
import app from 'app';
import ol from 'ol-all';

const LAYER_NAME = 'markerLayer';

export class Plugin extends app.Component {

    removeLayer() {
        for (let la of app.map().getLayers().getArray()) {
            if (la.get('name') === LAYER_NAME) {
                app.map().removeLayer(la);
                return;
            }
        }

    }

    addlayer() {
        this.removeLayer();
        let la = new ol.layer.Vector({
            source: new ol.source.Vector({
                projection: app.config.str('map.crs.client')
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
            })
        });
        la.set('name', LAYER_NAME);
        app.map().addLayer(la);
        return la;
    }

    componentDidMount() {
        this.on('marker.show.coordinate', xy => this.setPoint(xy));
        this.on('marker.show.geometry', geom => this.setGeometry(geom));
    }

    setPoint(xy) {
        this.setGeometry(new ol.geom.Circle(xy, 50));
    }

    setGeometry(geom) {
        let la = this.addlayer();
        la.getSource().addFeature(new ol.Feature(geom));


    }


}