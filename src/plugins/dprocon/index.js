/**
 * @module plugins/dprocon
 *
 * @desc
 *
 * D-ProCon connector
 *
 */


import React from 'react';

import app from 'app';
import ol from 'ol-all';

import * as toolbar from 'components/Toolbar';

class Plugin extends app.Plugin {

    init() {

        this.action('dproconConnect', () => {
            let sel = app.get('selectionGeometry');

            if (!sel)
                return;

            let wkt = new ol.format.WKT();


            let data = {
                plugin: 'dprocon',
                cmd: 'connect',
                bounds: wkt.writeGeometry(sel)
            };

            let done = ({response, error}) => {
                if (error)
                    app.perform('alert', {
                        content: __("gwc.plugin.dprocon.connectError")
                    });
                else
                    location.href = response.redirect_url;
            };

            app.perform('gbdServerPost', {
                data, done
            });
        });
    }
}


class Button extends React.Component {

    render() {
        return (
            <toolbar.Button
                {...this.props}
                tooltip={__("gwc.plugin.dprocon.buttonTooltip")}
                onClick={() => app.perform('dproconConnect')}
                icon='people'
            />
        );
    }
}

export default {
    Plugin,
    Button: app.connect(Button, ['selectionGeometry']),
};

