import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import app from 'app';


export default class App extends React.Component {
    async componentDidMount() {
        app.config.init(window.APP_CONFIG);
        let map = app.map();
        this.props.plugins.forEach(p => p.init());
        await map.init('map-container')

    }

    render() {
        return (
            <ReactRedux.Provider store={app.store()}>
                <div id='app-wrap'>
                    <div id='map-container'/>
                    <MuiThemeProvider>
                        {this.props.ui}
                    </MuiThemeProvider>
                </div>
            </ReactRedux.Provider>
        )
    }
}

