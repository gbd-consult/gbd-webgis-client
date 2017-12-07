import app from 'app';
import ol from 'ol-all';

const categoryNames = {
    "aerialway": __("category_aerialway"),
    "aeroway": __("category_aeroway"),
    "amenity": __("category_amenity"),
    "barrier": __("category_barrier"),
    "building": __("category_building"),
    "boundary": __("category_boundary"),
    "craft": __("category_craft"),
    "emergency": __("category_emergency"),
    "highway": __("category_highway"),
    "historic": __("category_historic"),
    "house": __("category_house"),
    "landuse": __("category_landuse"),
    "leisure": __("category_leisure"),
    "man_made": __("category_man_made"),
    "natural": __("category_natural"),
    "office": __("category_office"),
    "power": __("category_power"),
    "railway": __("category_railway"),
    "shop": __("category_shop"),
    "tourism": __("category_tourism"),
    "vending": __("category_vending"),
    "waterway": __("category_waterway"),
};

function convert(rec) {
    return new ol.Feature({
        source: 'OSM',
        category: categoryNames[rec.category],
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
