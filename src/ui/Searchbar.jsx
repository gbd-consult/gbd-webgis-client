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
        var children_grouped = [];
        var children = React.Children.toArray(this.props.children);

        for (var i = 0; i < children.length; i++) {
            var firstChild = false;
            var lastChild = false;
            if (i == 0 && children.length > 1) {
                firstChild = true;
            } else if (i == children.length - 1) {
                lastChild = true;
            }
            children_grouped.push(
                <ToolbarGroup firstChild={firstChild} lastChild={lastChild}>
                    {children[i]}
                </ToolbarGroup>
            );
        }
        return (
            <Toolbar style={style}>
                {children_grouped}
            </Toolbar>
        );
    }
}
export default withWidth()(muiThemeable()(SearchToolbar));
