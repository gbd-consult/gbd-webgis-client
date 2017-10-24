import React from 'react';
import Drawer from 'material-ui/Drawer';
import CircularProgress from 'material-ui/CircularProgress';

import app from 'app';


export default class InfoPanel extends app.Component {
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
                <CircularProgress />));
    }

    render() {
        return (
            <Drawer
                openSecondary
                width="30%"
                open={this.state.visible}
            >
                {this.state.content}
            </Drawer>
        )
    }
}