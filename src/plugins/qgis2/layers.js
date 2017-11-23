import app from 'app';
import mapUtil from 'map-util';

function asciify(s) {
    s = s.toLowerCase();
    s = s.replace(/ä/g, 'ae');
    s = s.replace(/ö/g, 'oe');
    s = s.replace(/ü/g, 'ue');
    s = s.replace(/ß/g, 'ue');
    s = s.replace(/[^A-Za-z0-9.]/g, '');
    return s;
}

let _rootLayer;

async function load() {
    _rootLayer = await mapUtil.wms.enumLayers(app.config.str('qgis2.server'));
}

function getRoot() {
    return _rootLayer;
}

function get(what) {
    let start;

    if (what === 'active')
        start = app.map().getLayerById(app.get('layerActiveUid'));

    let layers = app.map()
        .getLayersOfKind('wmsImage', start)
        .filter(r => r.getVisible());

    let found = [];

    function _walk(ql, path) {
        let p = asciify(ql.wmsPath);
        if (ql.layers)
            return ql.layers.forEach(ql2 => _walk(ql2, path));
        else if (p.indexOf(path) === 0) {
            found.push(ql);
        }
    }

    layers.forEach(la => _walk(_rootLayer, asciify(la.get('wmsPath'))));
    return found;
}

function getNames(what) {
    return get(what).map(r => r.wmsName);

}


export default {
    load,
    getRoot,
    get,
    getNames
};
