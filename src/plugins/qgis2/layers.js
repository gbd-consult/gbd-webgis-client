import app from 'app';

function activeNames() {
    let activeLayer = app.map().getLayerById(app.get('layerActiveUid'));
    return app.map()
        .enumLayers(activeLayer)
        .filter(layer => layer.getVisible() && layer.get('type') === 'WMSImage' && layer.get('wmsName'))
        .map(layer => layer.get('wmsName'));
}

function visibleNames() {
    return app.map()
        .enumLayers()
        .filter(layer => layer.getVisible() && layer.get('type') === 'WMSImage' && layer.get('wmsName'))
        .map(layer => layer.get('wmsName'));
}

export default {
    activeNames,
    visibleNames
};
