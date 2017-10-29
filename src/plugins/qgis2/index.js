import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import app from 'app';
import ol from 'ol-all';

import wms from './wms';
import wfs from './wfs';


function activeLayerNames() {
    let activeLayer = app.map().getLayerById(app.get('layerActiveUid'));
    return app.map()
        .enumLayers(activeLayer)
        .filter(layer => layer.getVisible() && layer.get('type') === 'WMSImage' && layer.get('wmsName'))
        .map(layer => layer.get('wmsName'));
}

function visibleLayerNames() {
    return app.map()
        .enumLayers()
        .filter(layer => layer.getVisible() && layer.get('type') === 'WMSImage' && layer.get('wmsName'))
        .map(layer => layer.get('wmsName'));
}

class Plugin extends app.Plugin {

    async init() {
        await wms.loadLayers();

        this.action('identify', async ({uid, coordinate}) => {
            let layerNames = activeLayerNames();

            let features = await wms.query(
                coordinate,
                layerNames);

            app.perform('identifyReturn', {uid, results: features})
        });

        this.action('qgisPrint', async () => {
            let url = await wms.printURL(visibleLayerNames());
            //window.open(url)


        })



    }
}

class PrintButton extends React.Component {

    render() {
        return (
            <IconButton
                onClick={() => app.perform('qgisPrint')}
            >
                <FontIcon className="material-icons"
                >print</FontIcon>
            </IconButton>
        );
    }
}




export default {
    Plugin,
    PrintButton: app.connect(PrintButton)

};
