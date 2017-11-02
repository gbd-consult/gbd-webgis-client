import React from 'react';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import CircularProgress from 'material-ui/CircularProgress';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

import app from 'app';

class Plugin extends app.Plugin {
}

class Waiting  extends React.Component {
    render() {
        return <CircularProgress />
    }

}



class Statusbar extends React.Component {
    render() {
        var style = {
            position: 'absolute',
            bottom: 0,
            right: 0,
            display: this.props.width == SMALL ? 'none' : 'flex',
            height: 28,
            lineHeight: "28px",
        };
        return (
            <Paper
                style={style}
            >
                {this.props.appWaiting ? <Waiting/> : null}
                {this.props.children}
            </Paper>
        )
    }
}

export default {
    Plugin,
    Statusbar: app.connect(withWidth()(muiThemeable()(Statusbar)))
}
