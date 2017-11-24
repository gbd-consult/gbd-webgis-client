import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import app from 'app';
import ol from 'ol-all';

import * as toolbar from 'components/Toolbar';

import wms from './wms';
import wfs from './wfs';
import printer from './printer';
import layers from './layers';

let rad2deg = a => Math.floor(a / (Math.PI / 180));


class Plugin extends app.Plugin {

    async init() {
        await layers.load();

        app.set({printQuality: 72});

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
                app.perform('mapDefaultMode');
                if (this.sidebarWasVisible)
                    app.perform('sidebarShow');
                return;
            }
            this.sidebarWasVisible = app.get('sidebarVisible');
            app.perform('sidebarHide');
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
    }

    printURL(opts) {
        let map = app.map(),
            params = {};

        params.extent = app.get('overlayExtent');
        params.scale = map.getScale();
        params.rotation = rad2deg(map.getView().getRotation());
        params.layerNames = layers.getNames('visible');
        params.dpi = opts.quality;

        return wms.printURL(params);
    }
}


class PrintButton extends React.Component {

    render() {
        let active = this.props.mapMode === 'print';

        return (
            <div>
                <toolbar.Popover visible={active}>
                    <toolbar.PopoverGroup>
                        <SelectField
                            value={this.props.printQuality}
                            style={{width: 120, marginRight: 16, marginLeft: 8}}
                            labelStyle={{color: app.theme('palette.accentOnDark')}}
                            onChange={(event, index, value) => app.set({printQuality: value})}
                        >
                            <MenuItem value={72} primaryText="72dpi"/>
                            <MenuItem value={150} primaryText="150dpi"/>
                            <MenuItem value={300} primaryText="300dpi"/>
                        </SelectField>
                    </toolbar.PopoverGroup>

                    <toolbar.PopoverGroup>
                        <toolbar.Button
                            secondary
                            onClick={() => app.perform('printOpenPDF', {quality: this.props.printQuality})}
                            icon='print'
                            tooltip={__("printTooltip")}
                        />
                    </toolbar.PopoverGroup>
                    <toolbar.PopoverGroup>

                        <toolbar.Button
                            secondary
                            tooltip={__("cancelTooltip")}
                            onClick={() => app.perform('printModeToggle')}
                            icon='close'
                        />
                    </toolbar.PopoverGroup>
                </toolbar.Popover>

                {!active && <toolbar.Button
                    {...this.props}
                    onClick={() => app.perform('printModeToggle')}
                    icon='print'
                    tooltip={__("printTooltip")}
                />}
            </div>
        );
    }
}


export default {
    Plugin,
    PrintButton: app.connect(PrintButton, ['mapMode', 'printQuality']),
};
