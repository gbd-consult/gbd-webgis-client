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

    style() {
        let th = app.theme().gbd.ui.statusbar;

        return {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            display: 'flex',
            height: th.height,
            boxSizing: 'border-box',
            padding: '0 8px',
            alignItems: 'center',
            zIndex: helpers.zIndex.statusbar,
            backgroundColor: th.background
        };
    }

    render() {
        if (this.props.appIsMobile)
            return null;
        return (
            <Paper style={this.style()}>
                {this.props.children}
            </Paper>
        )
    }
}

Statusbar.Widgets = {...sb};
Statusbar.Widgets.Progress = app.connect(sb.Progress, ['appWaiting']);


export default {
    Plugin,
    Statusbar: app.connect(Statusbar, ['appIsMobile', 'appWaiting']),
}
