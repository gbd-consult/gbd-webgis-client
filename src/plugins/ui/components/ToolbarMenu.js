import React from 'react';
import ToolbarButton from './ToolbarButton.js';
import IconMenu from 'material-ui/IconMenu';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

class ToolbarMenu extends React.Component {
    render() {
        let activeStyle = {
            color : this.props.muiTheme.palette.primary1Color,
        };
        let origin = {
            anchor : {
                mobile : { horizontal: 'left', vertical : 'top'},
                desktop : { horizontal: 'left', vertical : 'top'},
            },
            target : {
                mobile : { horizontal: 'right', vertical : 'bottom'},
                desktop : { horizontal: 'right', vertical : 'top'},
            },
        }
        return (
            <IconMenu
                iconButtonElement={<ToolbarButton {...this.props}/>}
                anchorOrigin={this.props.width === SMALL ? origin.anchor.mobile : origin.anchor.desktop }
                targetOrigin={this.props.width === SMALL ? origin.target.mobile : origin.target.desktop }
            >
                {React.Children.map(this.props.children, child => {
                    if (child.props.active) {
                        return React.cloneElement(child, {
                            style : activeStyle,
                            leftIcon : React.cloneElement(child.props.leftIcon, {
                                style : activeStyle,
                            }),
                        });
                    }
                    return child;
                })}
            </IconMenu>
        );
    }
}

export default withWidth()(muiThemeable()(ToolbarMenu));
