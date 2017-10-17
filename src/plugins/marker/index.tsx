import * as React from 'react';
import * as app from 'app';
import * as ol from 'openlayers';

const LAYER_NAME = 'markerLayer';

export class Plugin extends app.Component {

    removeLayer() {
        let m = app.map.get();
        for (let la of m.getLayers().getArray()) {
            if (la.get('name') === LAYER_NAME) {
                m.removeLayer(la);
                return;
            }
        }

    }

    addlayer() {
        this.removeLayer();
        let la = new ol.layer.Vector({
            source: new ol.source.Vector(),
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
        app.map.get().addLayer(la);
        return la;
    }

    componentDidMount() {
        this.on('marker.show.coordinate', xy => this.setPoint(xy));
        this.on('marker.show.geometry', geom => this.setGeometry(geom));
    }

    setPoint(xy: ol.Coordinate) {
        this.setGeometry(new ol.geom.Circle(xy, 50));
    }

    setGeometry(geom: ol.geom.Geometry) {
        let la = this.addlayer();
        la.getSource().addFeature(new ol.Feature(geom));


    }


}