import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

import layers from './layers';

async function request(verb, params) {
    let res = await app.http.get(app.config.str('qgis2.server'), {
        service: 'WMS',
        version: '1.3',
        request: verb,
        ...params
    });
    return ol.xml.parse(res);
}

function readFeature(node) {
    let props = {};

    [...node.querySelectorAll('Attribute')].forEach(a =>
        props[a.getAttribute('name')] = a.getAttribute('value')
    );

    if (props.geometry) {
        props.geometry = new ol.format.WKT().readGeometry(props.geometry, {
            dataProjection: app.config.str('map.crs.server'),
            featureProjection: app.config.str('map.crs.client')
        })
    }

    let feature = new ol.Feature(props);
    feature.setId(node.getAttribute('id'));

    return feature;
}

let _layerTitles;

async function query(coordinate, layerNames, limit = 100) {

    let bbox = ol.proj.transformExtent(
        app.map().getView().calculateExtent(),
        app.config.str('map.crs.client'),
        app.config.str('map.crs.server')
    );

    let pixel = app.map().getPixelFromCoordinate(coordinate);
    let size = app.map().getSize();

    function _walk(ql) {
        _layerTitles[ql.wmsName] = ql.name;
        if (ql.layers)
            ql.layers.forEach(ql2 => _walk(ql2));
    }

    if(!_layerTitles) {
        _layerTitles = {};
        _walk(layers.getRoot());
    }

    let doc = await request('GetFeatureInfo', {
        feature_count: limit,
        info_format: 'text/xml',
        crs: app.config.str('map.crs.server'),
        bbox: bbox.join(','),
        i: Math.round(pixel[0]),
        j: Math.round(pixel[1]),
        width: size[0],
        height: size[1],
        query_layers: layerNames.join(','),
        fi_point_tolerance: 16,
        fi_line_tolerance: 8,
        fi_polygon_tolerance: 4,
    });

    let fmap = {};

    [...doc.querySelectorAll('Layer')].forEach(layer => {
        let name = layer.getAttribute('name');
        name = _layerTitles[name] || name;

        [...layer.querySelectorAll('Feature')].forEach(feature => {
            let f = readFeature(feature);
            f.set('layerName', name);
            fmap[f.getId()] = f;
        });
    });

    return Object.values(fmap);
}

async function printTemplates() {
    let capsDoc = await request('GetProjectSettings');

    return [...capsDoc.querySelectorAll('ComposerTemplate')].map(t => {
        let maps = [...t.querySelectorAll('ComposerMap')].map(m => ({
            name: m.getAttribute('name'),
            width: Number(m.getAttribute('width')),
            height: Number(m.getAttribute('height')),
        }));
        return {
            name: t.getAttribute('name'),
            maps
        }
    });
}


function printURL({layerNames, extent, rotation, scale, dpi}) {

    extent = ol.proj.transformExtent(extent,
        app.config.str('map.crs.client'),
        app.config.str('map.crs.server')
    );

    let p = {
        service: 'WMS',
        version: '1.3',
        request: 'GetPrint',
        format: 'pdf',
        EXCEPTIONS: 'application/vnd.ogc.se_inimage',
        transparent: 'true',
        srs: app.config.str('map.crs.server'),
        dpi: dpi,
        template: app.config.str('qgis2.print.template'),
        layers: encodeURIComponent(layerNames.join(',')),
        opacities: encodeURIComponent(layerNames.map(() => 255).join(',')),
        'map0:extent': extent.join(','),
        'map0:rotation': rotation,
        //'map0:scale': scale,
        'map0:grid_interval_x': 2000,
        'map0:grid_interval_y': 2000,
    };

    let qs = Object.keys(p).map(k => k + '=' + p[k]).join('&');
    return app.config.str('qgis2.server') + '&' + qs;

}


export default {
    query,
    printTemplates,
    printURL
};
