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
        app.update('appControlHidden', {dprocon: true});

        this.action('authUserChanged', () => {
            let data = {
                plugin: 'dprocon',
                cmd: 'check_enabled'
            }
            app.perform('gbdServerPost', {
                data, done: ({response}) =>
                    app.update('appControlHidden', {dprocon: !response.enabled})
            });
        });

        this.action('dproconConnect', () => {
            let sel = app.get('selectionGeometryWKT');

            if (!sel)
                return;

            let data = {
                plugin: 'dprocon',
                cmd: 'connect_form',
                selection: sel
            };

            app.perform('gbdServerPostNewWindow', {data});
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

