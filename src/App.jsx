import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import app from 'app';

export default class App extends app.Component {
    async componentDidMount() {
        app.config.init(window.APP_CONFIG);
        console.log(window.APP_CONFIG)
        let map = await app.loadMap();
        map.setTarget('map-container');
    }

    ui() {
        return null;
    }

    plugins() {
        return null;
    }

    render() {
        return (
            <div id='app-wrap'>
                <div id='map-container'/>
                <MuiThemeProvider>
                    {this.ui()}
                </MuiThemeProvider>
               {this.plugins()}
            </div>
        )
    }
}

