import React from 'react';
import * as md from 'react-md';
import app from 'app';


export class InfoPanel extends app.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            visible: false
        }
    }

    componentDidMount() {
        this.on('infopanel.update', (content) =>
            this.setState({content, visible: true}));

        this.on('infopanel.wait', () =>
            this.emit('infopanel.update',
                <md.CircularProgress id='InfoPanelProgress'/>));
    }

    render() {
        return (
            <md.Drawer
                position='right'
                visible={this.state.visible}
            >
                {this.state.content}
            </md.Drawer>
        )
    }
}