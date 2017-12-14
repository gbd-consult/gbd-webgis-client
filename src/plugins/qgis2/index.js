import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import * as toolbar from 'components/Toolbar';

let rad2deg = a => Math.floor(a / (Math.PI / 180));


class Plugin extends app.Plugin {

    async init() {
        app.set({printQuality: 72});

        this.action('search', async ({coordinate, geometry, done}) => {
            let startLayer = app.map().getSelectedLayer() || app.map().getLayerRoot();

            if (coordinate) {
                let reqs = startLayer.collect(la =>
                    (la.wmsQuery) ? la.wmsQuery(coordinate) : null);

                return done(_.uniqBy(
                    _.flatMap(await Promise.all(reqs)),
                    feature => feature.getId()));
            }

            // if (geometry) {
            //     return done(await wfs.query(
            //         geometry,
            //         layers.getNames('active')));
            // }
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
            this.startPrint();
        });

        this.action('printOpenPDF', (opts) => {
            window.open(this.printURL(opts))
        });
    }

    async startPrint() {

        let w = app.config.number('qgis2.print.width');
        let h = app.config.number('qgis2.print.height');

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
            bounds = app.get('overlayBounds'),
            extent = [].concat(
                map.getCoordinateFromPixel([bounds.left, bounds.top]),
                map.getCoordinateFromPixel([bounds.right, bounds.bottom])
            );

        extent = ol.proj.transformExtent(
            extent,
            app.config.str('map.crs.client'),
            app.config.str('map.crs.server')
        );

        let names = app.map().getLayerRoot().collect(la =>
            (la.isVisible() && la.wmsName) ? la.wmsName() : null);

        let p = {
            service: 'WMS',
            version: '1.3',
            request: 'GetPrint',
            format: 'pdf',
            EXCEPTIONS: 'application/vnd.ogc.se_inimage',
            transparent: 'true',
            srs: app.config.str('map.crs.server'),
            dpi: opts.quality,
            template: app.config.str('qgis2.print.template'),
            layers: encodeURIComponent(names.reverse().join(',')),
            opacities: encodeURIComponent(names.map(() => 255).join(',')),
            'map0:extent': extent.join(','),
            'map0:rotation': rad2deg(map.getView().getRotation()),
            //'map0:scale': map.getScale(),
            'map0:grid_interval_x': 2000,
            'map0:grid_interval_y': 2000,
        };

        let qs = Object.keys(p).map(k => k + '=' + p[k]).join('&');
        return app.config.str('qgis2.server') + '&' + qs;
    }
}


class PrintButton extends React.Component {

    render() {
        let active = this.props.mapMode === 'print';

        return (
            <div>
                <toolbar.Popover visible={active}>
                    <div style={{display: 'inline', minWidth: 130}}>
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
                    </div>

                    <toolbar.Button
                        secondary
                        onClick={() => app.perform('printOpenPDF', {quality: this.props.printQuality})}
                        icon='print'
                        tooltip={__("gwc.plugin.qgis2.printTooltip")}
                    />

                    <toolbar.Button
                        secondary
                        tooltip={__("gwc.plugin.qgis2.cancelTooltip")}
                        onClick={() => app.perform('printModeToggle')}
                        icon='close'
                    />
                </toolbar.Popover>

                {!active && <toolbar.Button
                    {...this.props}
                    onClick={() => app.perform('printModeToggle')}
                    icon='print'
                    tooltip={__("gwc.plugin.qgis2.printTooltip")}
                />}
            </div>
        );
    }
}


export default {
    Plugin,
    PrintButton: app.connect(PrintButton, ['mapMode', 'printQuality']),
};
/*

 */