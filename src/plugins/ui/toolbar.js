import React from 'react';

import app from 'app';

import helpers from './helpers';

class Plugin extends app.Plugin {
}

class Toolbar extends React.Component {
    style() {
        return {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            bottom: app.theme().gbd.ui.statusbar.height + app.theme().gbd.ui.gutter,
            right: app.theme().gbd.ui.gutter,
            zIndex: helpers.zIndex.toolbar
        }
    }

    render() {
        return (
            <div style={this.style()}>
                {React.Children.map(this.props.children, c => helpers.deviceCheck(this, c) && c)}
            </div>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(Toolbar, ['appIsMobile'])
}
