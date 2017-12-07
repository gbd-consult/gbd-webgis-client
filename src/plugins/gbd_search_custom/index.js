import app from 'app';
import ol from 'ol-all';

let limit = 50;

function convert(rec) {
    return new ol.Feature({
        source: rec.section,
        category: rec.section,
        text: rec.text.replace(/\\n/g, '\n'),
        popup: rec.popup,
        geometry: new ol.format.WKT().readGeometry(rec.wkt, {
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
                plugin: 'search_custom',
                cmd: 'search',
                query: text
            });

            done((res || [])
                .filter(r => r.wkt)
                .slice(0, limit)
                .map(convert));

        });
    }
}

export default {
    Plugin
};
