import app from 'app';
import ol from 'ol-all';

const categoryNames = {
    "alkis_strasse": "Strasse",
    "alkis_gemeinde": "Gemeinde"
};

let limit = 50;

function convert(rec) {
    return new ol.Feature({
        source: 'ALKIS',
        category: categoryNames[rec.category],
        text: rec.text,
        geometry: new ol.format.WKT().readGeometry(rec.wkt_geometry, {
            dataProjection: app.config.str('map.crs.server'),
            featureProjection: app.config.str('map.crs.client')
        })
    });
}

class Plugin extends app.Plugin {
    init() {

        this.action('search', async ({text, done}) => {
            if (!text)
                return;

            let res = await app.http.get(app.config.str('server.url'), {
                plugin: 'search_alkis',
                cmd: 'search',
                query: text
            });

            done((res || [])
                .filter(r => r.wkt_geometry)
                .slice(0, limit)
                .map(convert));

        });
    }
}

export default {
    Plugin
};
