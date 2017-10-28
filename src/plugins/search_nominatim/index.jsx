import app from 'app';
import ol from 'ol-all';

const categoryNames = {
    // http://wiki.openstreetmap.org/wiki/DE:Map_Features
    "aerialway": "Seilbahn",
    "aeroway": "Flughafen",
    "amenity": "Einrichtung",
    "barrier": "Barriere",
    "building": "Gebäude",
    "boundary": "Grenze",
    "craft": "Handwerk",
    "emergency": "Notfalleinrichtung",
    "highway": "Weg",
    "historic": "Historisch",
    "house": "Gebäude",
    "landuse": "Landnutzung",
    "leisure": "Freizeit",
    "man_made": "Kunstbauten",
    "natural": "Natur",
    "office": "Dienststelle",
    "power": "Energieversorgung",
    "railway": "Eisenbahn",
    "shop": "Geschäft",
    "tourism": "Tourismus",
    "vending": "Automaten",
    "waterway": "Wasserlauf"
};

function convert(rec) {
    return {
        category: categoryNames[rec.category],
        text: rec.text,
        geometry: new ol.format.WKT().readGeometry(rec.wkt)
    };
}

class Plugin extends app.Plugin {
    init() {

        this.action('search', async ({input}) => {

            let res = await app.http.get(app.config.str('server.url'), {
                plugin: 'search_nominatim',
                cmd: 'search',
                query: input,
                crs: app.config.str('map.crs.client'),
                viewbox: app.config.object('map.extent').join(',')
            });

            if (res && res.length) {
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
