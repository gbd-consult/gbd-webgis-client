import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import app from 'app';
import ol from 'ol-all';

import wms from './wms';
import wfs from './wfs';
import printer from './printer';
import layers from './layers';


class Plugin extends app.Plugin {

    async init() {
        await wms.loadLayers();

        this.action('identify', async ({uid, coordinate}) => {
            let features = await wms.query(
                coordinate,
                layers.activeNames());
            app.perform('identifyReturn', {uid, results: features})
        });

        this.action('qgisPrintToggleOverlay', async () => {
            if (app.get('mapMode') === printer.mapMode)
                return app.perform('mapDefaultMode');
            await printer.initOverlay();
        });
    }
}


class PrintButton extends React.Component {

    render() {
        let active = (this.props.mapMode === printer.mapMode);

        return (
            <div>
                <IconButton onClick={() => app.perform('qgisPrintToggleOverlay')}>
                    <FontIcon className="material-icons">print</FontIcon>
                </IconButton>
                { active ? <printer.Overlay/> : null }
            </div>

        );
    }
}


export default {
    Plugin,
    PrintButton: app.connect(PrintButton, ['mapMode']),
};
