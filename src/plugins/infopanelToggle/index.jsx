import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import app from 'app';

export class Plugin extends app.Component {}


export class Button extends app.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    componentDidMount() {
        this.on('infopanel.close', () => this.setState({visible : false}));
        this.on('infopanel.open', () => this.setState({visible : true}));
        this.on('infopanel.update', () => this.setState({visible : true}));
    }

    onClick() {
        if (this.state.visible) {
            this.emit('infopanel.close');
        } else {
            this.emit('infopanel.open');
        }
    }

    render() {
        return (
            <IconButton
                onClick={() => this.onClick()}
            >
                <FontIcon className='material-icons'>
                    {this.state.visible ? 'expand_less' : 'expand_more'}
                </FontIcon>
            </IconButton>
        );
    }
}
