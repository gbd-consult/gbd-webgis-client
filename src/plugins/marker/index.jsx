import React from 'react';
import app from 'app';
import ox from 'ox';

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
        let la = new ox.layer.Vector({
            source: new ox.source.Vector(),
            style: new ox.style.Style({
                fill: new ox.style.Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                }),
                stroke: new ox.style.Stroke({
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

    setPoint(xy) {
        this.setGeometry(new ox.geom.Circle(xy, 50));
    }

    setGeometry(geom) {
        let la = this.addlayer();
        la.getSource().addFeature(new ox.Feature(geom));


    }


}