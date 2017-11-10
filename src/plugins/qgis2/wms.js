import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

async function request(verb, params) {
    let res = await app.http.get(app.config.str('qgis2.server'), {
        service: 'WMS',
        version: '1.3',
        request: verb,
        ...params
    });
    return ol.xml.parse(res);
}

function children(el, tag) {
    return [...el.childNodes].filter(e => e.nodeName === tag);
}

function child(el, tag) {
    let cn = children(el, tag);
    if (cn.length !== 1)
        return null;
    return cn[0];
}

function get(el, tags) {
    for (let tag of tags.match(/\w+/g)) {
        if (!el)
            return null;
        el = child(el, tag);
    }

    return el;
}


function getText(el, path) {
    el = get(el, path);
    return el && el.firstChild ? el.firstChild.nodeValue : '';
}


function imgLoad(image, src) {
    //let u = new URL(src), s = u.searchParams;
    //console.log('loading', `${s.get('LAYERS')} -- ${s.get('WIDTH')}x${s.get('HEIGHT')} -- ${s.get('BBOX')}`)
    image.getImage().src = src;
}

function parseLayer(el) {
    let opts = {
        name: getText(el, 'Title'),
        wmsName: getText(el, 'Name'),
        wmsLegendURL: getText(el, 'Style LegendURL OnlineResource')
    };

    let minScale = getText(el, 'MinScaleDenominator');
    let maxScale = getText(el, 'MaxScaleDenominator');

    if (minScale)
        opts.minResolution = mapUtil.scaleToResolution(Number(minScale));

    if (maxScale)
        opts.maxResolution = mapUtil.scaleToResolution(Number(maxScale));

    let sub = children(el, 'Layer');

    if (sub.length) {
        return new ol.layer.Group({
            ...opts,
            kind: 'Qgis2Group',
            layers: sub.reverse().map(parseLayer)
        });
    }

    opts.source = new ol.source.ImageWMS({
        url: app.config.str('qgis2.server'),
        params: {
            LAYERS: opts.name
        },
        ratio: 1,
        preload: 0,
        imageLoadFunction: imgLoad
    });

    return new ol.layer.Image({
        ...opts,
        kind: 'Qgis2Image'
    });
}

function parseLayers(doc) {
    let root,
        layers = children(child(doc, 'Capability'), 'Layer').map(parseLayer);


    if (!layers.length) {
        return null;
    }

    if (layers.length === 1) {
        root = layers[0];
    } else {
        root = new ol.layer.Group({
            layers
        });
    }

    root.set('kind', 'Qgis2Root');
    return root;
}


async function loadLayers() {
    let descDoc = await request('GetCapabilities');

    let root = parseLayers(descDoc.firstChild);
    if (root) {
        app.map().attachLayer('project', root);
    }
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

async function query(coordinate, layerNames, limit = 100) {

    let bbox = ol.proj.transformExtent(
        app.map().getView().calculateExtent(),
        app.config.str('map.crs.client'),
        app.config.str('map.crs.server')
    );

    let pixel = app.map().getPixelFromCoordinate(coordinate);
    let size = app.map().getSize();


    let featuresDoc = await request('GetFeatureInfo', {
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

    [...featuresDoc.querySelectorAll('Feature')]
        .map(readFeature)
        .forEach(feature => fmap[feature.getId()] = feature);

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


function printURL({layerNames, extent, rotation, scale}) {

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
        dpi: app.config.number('qgis2.print.resolution'),
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
    loadLayers,
    query,
    printTemplates,
    printURL
};
