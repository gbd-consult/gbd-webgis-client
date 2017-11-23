import React from 'react';

import app from 'app';
import ol from 'ol-all';

import ToolbarButton from 'components/ToolbarButton';
import ToolbarGroup from 'components/ToolbarGroup';

import wms from './wms';
import wfs from './wfs';
import printer from './printer';
import layers from './layers';

let rad2deg = a => Math.floor(a / (Math.PI / 180));


class Plugin extends app.Plugin {

    async init() {
        await layers.load();

        this.action('search', async ({coordinate, geometry, done}) => {
            if (coordinate) {
                return done(await wms.query(
                    coordinate,
                    layers.getNames('active')));
            }
            if (geometry) {
                return done(await wfs.query(
                    geometry,
                    layers.getNames('active')));
            }
        });

        this.action('printModeToggle', async () => {
            if (app.get('mapMode') === 'print') {
                return app.perform('mapDefaultMode');
            }
            await this.startPrint();
        });

        this.action('printOpenPDF', (opts) => {
            window.open(this.printURL(opts))
        });

    }

    async startPrint() {
        let templates = await wms.printTemplates();

        let w = templates[0].maps[0].width;
        let h = templates[0].maps[0].height;

        app.perform('mapSetMode', {
            name: 'print',
            cursor: 'crosshair',
            interactions: [
                'DragPan',
                'MouseWheelZoom'
            ],
            overlay: {width: window.innerWidth / 2, ratio: w / h}
        });

        app.set({printQuality: app.get('printQuality') || 0});

    }

    printURL(opts) {
        let map = app.map(),
            params = {},
            dpis = [72, 150, 300];

        params.extent = app.get('overlayExtent');
        params.scale = map.getScale();
        params.rotation = rad2deg(map.getView().getRotation());
        params.layerNames = layers.getNames('visible');
        params.dpi = dpis[opts.quality || 0];

        return wms.printURL(params);
    }
}


class PrintButton extends React.Component {

    render() {
        return (
            <div>
                <ToolbarGroup visible={this.props.mapMode === 'print'}>
                    <ToolbarButton
                        secondary
                        onClick={() => app.perform('printOpenPDF', {quality: 0})}
                        icon='filter_1'
                        tooltip={__("quality0")}
                    />
                    <ToolbarButton
                        secondary
                        onClick={() => app.perform('printOpenPDF', {quality: 1})}
                        icon='filter_2'
                        tooltip={__("quality1")}
                    />
                    <ToolbarButton
                        secondary
                        onClick={() => app.perform('printOpenPDF', {quality: 3})}
                        icon='filter_3'
                        tooltip={__("quality2")}
                    />
                    <ToolbarButton
                        secondary
                        tooltip={__("cancelTooltip")}
                        onClick={() => app.perform('printModeToggle')}
                        icon='close'
                    />
                </ToolbarGroup>
                <ToolbarButton
                    {...this.props}
                    onClick={() => app.perform('printModeToggle')}
                    icon='print'
                    tooltip={__("printTooltip")}
                />
            </div>
        );
    }
}


export default {
    Plugin,
    PrintButton: app.connect(PrintButton, ['mapMode', 'printQuality']),
};
