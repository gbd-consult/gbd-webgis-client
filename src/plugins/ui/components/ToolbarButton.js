import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';


class ToolbarButton extends React.Component {
    render(){
        let style = {
            marginBottom: '10px',
            marginRight: '10px',
            borderRadius: '50%',
            background: this.props.primary
                ? this.props.muiTheme.palette.primary1Color
                : this.props.active
                ? this.props.muiTheme.palette.accent1Color
                : this.props.muiTheme.palette.accent3Color,
            display: !this.props.showMobile && this.props.width === SMALL
                ? 'none' : 'inherit',
        };
        return(
            <Paper
                circle
                style={style}
                zDepth={1}
            >
                <IconButton
                    tooltip={this.props.tooltip}
                    tooltipPosition='bottom-left'
                    onClick={this.props.onClick}
                >
                    <FontIcon 
                        className="material-icons" 
                        color={this.props.muiTheme.palette.alternateTextColor}
                    >
                        {this.props.icon}
                    </FontIcon>
                </IconButton>
            </Paper>
        );
    }
}

export default withWidth()(muiThemeable()(ToolbarButton));
