import app from 'app';
import ol from 'ol-all';

const categoryNames = {
    "alkis_strasse": "Strasse",
    "alkis_gemeinde": "Gemeinde"
};

function convert(rec) {
    return {
        category: categoryNames[rec.category],
        text: rec.text,
        geometry: new ol.format.WKT().readGeometry(rec.wkt_geometry, {
            dataProjection: app.config.str('map.crs.server'),
            featureProjection: app.config.str('map.crs.client')
        })
    };
}

class Plugin extends app.Plugin {
    init() {

        this.action('search', async ({input}) => {

            let res = await app.http.get(app.config.str('server.url'), {
                plugin: 'search_alkis',
                cmd: 'search',
                query: input
            });

            if(res && res.length) {
                app.perform('searchReturn', {
                    results: res.map(convert)
                });
            }
        });
    }
}

export default {
    Plugin
};
