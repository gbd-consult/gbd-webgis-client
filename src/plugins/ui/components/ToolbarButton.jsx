import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import muiThemeable from 'material-ui/styles/muiThemeable';


class ToolbarButton extends React.Component {
    render(){
        var style = {
            marginBottom: '10px',
            borderRadius: '50%',
            background: this.props.active
                ? this.props.muiTheme.palette.accent1Color
                : this.props.muiTheme.palette.accent3Color,
        };
        return(
            <IconButton
                tooltip={this.props.tooltip}
                tooltipPosition='bottom-left'
                onClick={this.props.onClick}
                style={style}
            >
                <FontIcon className="material-icons" color={this.props.muiTheme.palette.alternateTextColor}>
                    {this.props.icon}
                </FontIcon>
            </IconButton>
        );
    }
}

export default muiThemeable()(ToolbarButton);
