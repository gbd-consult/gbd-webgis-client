import React from 'react';

import app from 'app';

import helpers from './helpers';

class Plugin extends app.Plugin {
}

class Toolbar extends React.Component {
    style() {
        return {
            position: 'absolute',
            flexDirection: 'column',
            alignItems: 'flex-end',
            bottom: app.theme().gbd.ui.statusbar.height + app.theme().gbd.ui.gutter,
            right: 0,
            zIndex: helpers.zIndex.toolbar
        }
    }

    render() {
        return (
            <div style={this.style()}>
                {React.Children.map(this.props.children, c => helpers.deviceCheck(this, c) && <div style={{
                    boxSizing: 'border-box',
                    position: 'relative',
                    paddingTop: app.theme().gbd.ui.gutter/2,
                    height:  app.theme().gbd.ui.toolbar.button.size + app.theme().gbd.ui.gutter,
                }}>
                    {c}
                </div>)}
            </div>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(Toolbar, ['appIsMobile'])
}
