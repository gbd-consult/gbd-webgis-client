import React from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
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
            height: this.props.muiTheme.toolbar.height / 2,
            lineHeight: this.props.muiTheme.toolbar.height / 2 + 'px',
        };
        var childStyle = {
            paddingLeft: 5,
            paddingRight: 5,
            borderRightStyle: 'solid',
            borderRightWidth: 1,
            borderRightColor: this.props.muiTheme.palette.borderColor,
        };
        return (
            <Paper
                style={style}
            >
                {this.props.appWaiting ? <Waiting/> : null}
                {React.Children.map(this.props.children, child => {
                    return (
                        <div style={childStyle}>
                            {child}
                        </div>
                    )
                })}
            </Paper>
        )
    }
}

export default {
    Plugin,
    Statusbar: app.connect(withWidth()(muiThemeable()(Statusbar)))
}
