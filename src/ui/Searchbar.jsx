import React from 'react';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

class SearchToolbar extends React.Component {
    render(){
        var style = {
            position: 'absolute',
            top: '0',
            left: '0',
            backgroundColor: this.props.muiTheme.palette.primary1Color,
            width: this.props.width == SMALL ? '100%' : '450px',
            zIndex: '1500',
        };
        return (
            <Toolbar style={style}>
            </Toolbar>
        );
    }
}
export default withWidth()(muiThemeable()(SearchToolbar));
