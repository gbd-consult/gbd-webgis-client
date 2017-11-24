import React from 'react';

import app from 'app';
import helpers from './helpers';

class Plugin extends app.Plugin {
}

class Altbar extends React.Component {
    render() {
        return (
            <div style={app.theme('gwc.ui.altbar')}>
                {React.Children.map(this.props.children, c => helpers.deviceCheck(this, c) && c)}
            </div>
        )
    }
}

export default {
    Plugin,
    Altbar: app.connect(Altbar, ['appWidth', 'appIsMobile'])
}
