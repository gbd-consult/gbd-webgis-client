import React from 'react';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

import app from 'app';
import * as sb from 'components/StatusbarWidgets';

import helpers from './helpers';

class Plugin extends app.Plugin {
}

class Statusbar extends React.Component {

    render() {
        if (this.props.appIsMobile && this.props.sidebarVisible)
            return null;
        return (
            <Paper style={app.theme('gwc.ui.statusbar.container')}>
                {React.Children.map(this.props.children, c => helpers.deviceCheck(this, c) && c)}
            </Paper>
        )
    }
}

Statusbar.Widget = {...sb};


export default {
    Plugin,
    Statusbar: app.connect(Statusbar, ['appIsMobile', 'appWaiting', 'sidebarVisible']),
}
