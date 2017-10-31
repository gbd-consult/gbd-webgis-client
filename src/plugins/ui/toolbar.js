import React from 'react';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import app from 'app';

class Plugin extends app.Plugin {
}

class Toolbar2 extends React.Component {
    render() {
        var style = {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
        };
        var childStyle = { marginBottom: '10px' };
        return (
            <div style={style}>
                {React.Children.map(this.props.children, child => {
                    return React.cloneElement(child, {
                        style: childStyle
                    })
                })}
            </div>
        );
    }
}


export default {
    Plugin,
    Toolbar: app.connect(Toolbar2)
}
