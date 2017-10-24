import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import VerticalDrawer from './components/VerticalDrawer';
import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, { SMALL } from 'material-ui/utils/withWidth';

import app from 'app';


class InfoPanel extends app.Component {
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

        this.on('infopanel.close', () =>
            this.setState({visible: false}));

        this.on('infopanel.open', () =>
            this.setState({visible: true}));

        this.on('infopanel.wait', () =>
            this.emit('infopanel.update',
                <CircularProgress />));
    }

    render() {
        return (
            <VerticalDrawer
                open={this.state.visible}
                docked={true}
                width={this.props.width == SMALL ? '100%' : 450}
                containerStyle={{paddingTop : this.props.muiTheme.toolbar.height}}
            >
                {this.state.content}
            </VerticalDrawer>
        )
    }
}

export default withWidth()(muiThemeable()(InfoPanel));
