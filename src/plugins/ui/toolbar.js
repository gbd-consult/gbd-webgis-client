import React from 'react';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import app from 'app';

class Plugin extends app.Plugin {
}

class Toolbar2 extends React.Component {
    render() {
        return (
            <Toolbar
                style={{position: 'fixed', right: 0, bottom: 30}}
            >{this.props.children}
            </Toolbar>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(Toolbar2)
}
