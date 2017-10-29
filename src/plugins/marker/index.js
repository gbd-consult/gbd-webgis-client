import app from 'app';
import ol from 'ol-all';

const LAYER_NAME = 'markerLayer';

class Plugin extends app.Plugin {

    init() {

        this.style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#fffa27',
                lineDash: [3, 3],
                width: 1
            }),
        });

        this.action('markerMark', ({geometries, pan}) => {
            this.clear();
            this.mark(geometries);
            if (pan)
                this.pan();
        });

        this.action('markerClear', () => this.clear());
    }

    getLayer() {
        for (let la of app.map().getLayers().getArray()) {
            if (la.get('name') === LAYER_NAME) {
                return la;
            }
        }
    }

    removeLayer() {
        let la = this.getLayer();
        if (la) {
            app.map().removeLayer(la);
        }
    }

    addLayer() {
        let la = this.getLayer();

        if (la)
            return la;

        la = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: this.style
        });

        la.setZIndex(10);

        la.set('name', LAYER_NAME);
        app.map().addLayer(la);
        return la;
    }

    mark(geometries) {
        let la = this.addLayer();
        la.getSource().addFeatures(geometries.map(g => new ol.Feature(g)));
    }

    pan() {
        let la = this.getLayer();

        if (la && la.getSource().getFeatures().length) {
            let extent = la.getSource().getExtent();
            app.map().getView().fit(ol.extent.buffer(extent, 100));
        }
    }

    clear() {
        this.removeLayer();
    }


}


export default {
    Plugin
};
