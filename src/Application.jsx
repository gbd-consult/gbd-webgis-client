import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import app from 'app';


export default class Application extends React.Component {
    async componentDidMount() {
        app.config.init(window.APP_CONFIG);
        let map = app.map();
        app.set(this.props.initState);
        this.props.plugins.forEach(p => p.init());
        await map.init('map-container')

    }

    render() {
        let theme = getMuiTheme(this.props.theme);
        return (
            <ReactRedux.Provider store={app.store()}>
                <div id='app-wrap'>
                    <div id='map-container'/>
                    <MuiThemeProvider muiTheme={theme}>
                        {this.props.ui}
                    </MuiThemeProvider>
                </div>
            </ReactRedux.Provider>
        )
    }
}

