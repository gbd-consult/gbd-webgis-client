import React from 'react';

import ToolbarButton from '../ui/components/ToolbarButton.js';

import app from 'app';
import ol from 'ol-all';

import wms from './wms';
import wfs from './wfs';
import printer from './printer';
import layers from './layers';


class Plugin extends app.Plugin {

    async init() {
        await wms.loadLayers();

        this.action('search', async ({coordinate, geometry, done}) => {
            if (coordinate) {
                return done(await wms.query(
                    coordinate,
                    layers.activeNames()));
            }
            if (geometry) {
                return done(await wfs.query(
                    geometry,
                    layers.activeNames()));
            }
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
                <ToolbarButton
                    {...this.props}
                    active={active}
                    onClick={() => app.perform('qgisPrintToggleOverlay')}
                    icon='print'
                    tooltip={__("printTooltip")}
                />
                { active ? <printer.Overlay/> : null }
            </div>

        );
    }
}


export default {
    Plugin,
    PrintButton: app.connect(PrintButton, ['mapMode']),
};
