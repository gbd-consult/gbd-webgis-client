import * as React from 'react';
import * as md from 'react-md';
import * as app from 'app';


export class InfoPanel extends app.Component {
    state = {
        visible: false,
        content: null
    };

    componentDidMount() {
        this.on('infopanel.update', (content: React.Component) =>
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