import app from 'app';

function activeNames() {
    let activeLayer = app.map().getLayerById(app.get('layerActiveUid'));
    return app.map()
        .getLayersOfKind('Qgis2Image', activeLayer)
        .filter(layer => layer.getVisible())
        .map(layer => layer.get('wmsName'))
        .filter(Boolean);
}

function visibleNames() {
    return app.map()
        .getLayersOfKind('Qgis2Image')
        .filter(layer => layer.getVisible())
        .map(layer => layer.get('wmsName'))
        .filter(Boolean);

}

export default {
    activeNames,
    visibleNames
};
