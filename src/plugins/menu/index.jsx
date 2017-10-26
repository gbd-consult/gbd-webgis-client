import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import app from 'app';

export class Plugin extends app.Component {}


export class Button extends app.Component {
    constructor(props) {
        super(props);
        this.state = {
            open : false,
        };
    }

    onClick() {
        this.setState({ open : !this.state.open });
    }

    render() {
        return (
            <div>
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <MenuItem>Test</MenuItem>
                    <MenuItem>Fnord</MenuItem>
                    <MenuItem>Digitalisieren</MenuItem>
                </Drawer>
                <IconButton
                    onClick={() => this.onClick()}
                >
                    <FontIcon className='material-icons'>
                        menu
                    </FontIcon>
                </IconButton>
            </div>
        );
    }
}
