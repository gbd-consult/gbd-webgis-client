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

        this.action('authUserChanged', ({user}) => {
            let hasPerm = user && user.permissions.includes('DPROCON');
            app.update('appControlHidden', {dprocon: !hasPerm});
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

