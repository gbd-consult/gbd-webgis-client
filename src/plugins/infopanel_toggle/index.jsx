/// demo plugin

import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

import ol from 'ol-all';
import app from 'app';

export class Plugin extends app.Component {}


export class Button extends app.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    onClick() {
        if (this.state.visible) {
            this.setState({visible : false});
            this.emit('infopanel.close');
        } else {
            this.setState({visible : true});
            this.emit('infopanel.open');
        }
    }

    render() {
        return (
            <FloatingActionButton
                onClick={() => this.onClick()}
                secondary
            >
                <FontIcon className='material-icons'>
                    cake
                </FontIcon>
            </FloatingActionButton>
        );
    }
}
