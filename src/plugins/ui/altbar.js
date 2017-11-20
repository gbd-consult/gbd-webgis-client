import React from 'react';

import app from 'app';
import helpers from './helpers';

class Plugin extends app.Plugin {
}

class Altbar extends React.Component {
    style() {
        return {
            position: 'absolute',
            top: app.theme().gbd.ui.gutter,
            right: app.theme().gbd.ui.gutter,
            zIndex: helpers.zIndex.altbar,
        }
    }

    render() {
        return (
            <div style={this.style()}>
                {React.Children.map(this.props.children, c => helpers.deviceCheck(this, c) && c)}
            </div>
        )
    }
}

export default {
    Plugin,
    Altbar: app.connect(Altbar, ['appWidth', 'appIsMobile'])
}
