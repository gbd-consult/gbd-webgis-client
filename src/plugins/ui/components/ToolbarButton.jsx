import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import muiThemeable from 'material-ui/styles/muiThemeable';


class ToolbarButton extends React.Component {
    render(){
        var style = {
            marginBottom: '10px',
        };
        var bg = this.props.active
            ? this.props.muiTheme.palette.accent1Color
            : this.props.muiTheme.palette.accent3Color;
        return(
            <FloatingActionButton
                onClick={this.props.onClick}
                style={style}
                backgroundColor={bg}
            >
                <FontIcon className="material-icons">
                    {this.props.icon}
                </FontIcon>
            </FloatingActionButton>
        );
    }
}

export default muiThemeable()(ToolbarButton);
