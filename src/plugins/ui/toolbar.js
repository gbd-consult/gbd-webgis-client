import React from 'react';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import app from 'app';

class Plugin extends app.Plugin {
}

class Toolbar2 extends React.Component {
    render() {
        var style = {
            position: 'absolute',
            top: '10px',
            right: '10px',
        };
        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(Toolbar2)
}
