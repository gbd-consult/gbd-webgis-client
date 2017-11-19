import React from 'react';

import app from 'app';

import zindex from './zindex';

class Plugin extends app.Plugin {
}

class Toolbar extends React.Component {
    style() {
        let b = this.props.appIsMobile ? 0 : app.theme().gbd.ui.statusbar.height;

        return {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            bottom:
                b +
                app.theme().gbd.ui.toolbar.gutter,
            right: app.theme().gbd.ui.toolbar.gutter,
            zIndex: zindex.toolbar
        }
    }

    render() {
        return (
            <div style={this.style()}>
                {this.props.children}
            </div>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(Toolbar, ['appIsMobile'])
}
