import app from 'app';
import ol from 'ol-all';


async function request(params) {
    let res = await app.http.get(app.config.str('qgis2.server'), params);
    return ol.xml.parse(res);
}

async function describe() {

    let descDoc = await request({
        service: 'WFS',
        version: '1.0.0',
        request: 'DescribeFeatureType',
    });

    let tmap = {};

    for (let typeEl of descDoc.querySelectorAll('complexType')) {
        let name = typeEl.getAttribute('name').replace(/Type$/, ''),
            props = {};
        for (let el of typeEl.querySelectorAll('element')) {
            props[el.getAttribute('name')] = el.getAttribute('type');
        }
        tmap[name] = props;
    }

    return tmap;

}

async function query(geometry, layerNames = null, limit = 100) {
    let tmap = await describe();

    let qtypes = Object.keys(tmap);

    if (layerNames)
        qtypes = qtypes.filter(t => layerNames.includes(t));

    let bbox = ol.proj.transformExtent(
        geometry.getExtent(),
        app.config.str('map.crs.client'),
        app.config.str('map.crs.server')
    );

    let featuresDoc = await request({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typename: qtypes.join(','),
        bbox: bbox.join(','),
        maxFeatures: limit
    });

    let fmt = new ol.format.WFS({
        gmlFormat: new ol.format.GML2()
    });

    return fmt.readFeatures(featuresDoc, {
        dataProjection: app.config.str('map.crs.server'),
        featureProjection: app.config.str('map.crs.client')
    });
}



export default {
    query,
};
