import app from 'app';
import ol from 'ol-all';

import _ from 'lodash';

const LAYER_KIND = 'markerLayer';

function style(opts) {

    Object.keys(opts).forEach(key => {

        let val = opts[key];

        if (key === 'fill' && _.isPlainObject(val))
            opts[key] = new ol.style.Fill(val);

        if (key === 'stroke' && _.isPlainObject(val))
            opts[key] = new ol.style.Stroke(val);

        if (key === 'text' && _.isPlainObject(val))
            opts[key] = new ol.style.Text(val);
    });

    return new ol.style.Style(opts);

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
                width: 1
            },
        };

        this.action('markerMark', ({geometries, pan}) => {
            this.clear();
            this.mark(geometries);
            if (pan)
                this.pan();
        });

        this.action('markerClear', () => this.clear());
    }

    mark(geometries) {
        let la = app.map().serviceLayer(LAYER_KIND, () => new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: style(this.style)
        }));
        la.getSource().addFeatures(geometries.map(g => new ol.Feature(g)));
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
