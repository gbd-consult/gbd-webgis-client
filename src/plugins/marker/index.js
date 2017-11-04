import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

const LAYER_KIND = 'markerLayer';

function getGeometry(feature) {
}


class Plugin extends app.Plugin {

    init() {

        this.style = {
            fill: {
                color: 'rgba(0, 0, 255, 0.5)'
            },
            stroke: {
                color: '#fffa27',
                lineDash: [3, 3],
                width: 2
            },
        };

        this.action('markerMark', ({features, pan}) => {
            this.clear();
            this.mark(features);
            if (pan)
                this.pan();
        });

        this.action('markerClear', () => this.clear());
    }

    mark(features) {
        let geoms = features
            .filter(Boolean)
            .map(f => f.getGeometry())
            .filter(Boolean);

        if (geoms.length) {
            let la = app.map().serviceLayer(LAYER_KIND, () => new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: mapUtil.makeStyle(this.style)
            }));
            la.getSource().addFeatures(geoms.map(g => new ol.Feature(g)));
        }
    }

    pan() {
        let la = app.map().serviceLayer(LAYER_KIND);

        if (la && la.getSource().getFeatures().length) {
            let extent = la.getSource().getExtent();
            app.map().getView().fit(ol.extent.buffer(extent, 100));
        }
    }

    clear() {
        app.map().removeServiceLayer(LAYER_KIND);
    }


}


export default {
    Plugin
};
