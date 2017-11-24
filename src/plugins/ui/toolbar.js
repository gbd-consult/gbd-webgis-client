import React from 'react';

import app from 'app';

import helpers from './helpers';

class Plugin extends app.Plugin {
}

class Toolbar extends React.Component {
    render() {
        return (
            <div style={app.theme('gwc.ui.toolbar.container')}>
                {React.Children.map(this.props.children, c => helpers.deviceCheck(this, c) &&
                    <div style={app.theme('gwc.ui.toolbar.wrapper')}>{c}</div>
                )}
            </div>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(Toolbar, ['appIsMobile'])
}
