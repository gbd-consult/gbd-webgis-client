import app from 'app';
import ol from 'ol-all';

function convert(rec) {
    return new ol.Feature({
        source: 'OSM',
        text: rec.text,
        geometry: new ol.format.WKT().readGeometry(rec.wkt)
    });
}

class Plugin extends app.Plugin {
    init() {

        this.action('search', async ({text, done}) => {
            if (!text)
                return;

            let res = await app.http.get(app.config.str('server.url'), {
                plugin: 'search_nominatim',
                cmd: 'search',
                query: text,
                crs: app.config.str('map.crs.client'),
                viewbox: app.config.object('map.extent').join(',')
            });

            done((res || []).map(convert));

        });
    }
}

export default {
    Plugin
};
