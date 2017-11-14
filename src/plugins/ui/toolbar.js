import React from 'react';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

import app from 'app';

class Plugin extends app.Plugin {
}

class Toolbar2 extends React.Component {
    render() {
        let style = {
            position: 'absolute',
            top: '10px',
            right: '0px',
        };
        let mobileStyle = {
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            display: 'inline-flex',
        };
        return (
            <div style={this.props.width === SMALL ? mobileStyle : style}>
                {this.props.children}
            </div>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(withWidth()(Toolbar2))
}
