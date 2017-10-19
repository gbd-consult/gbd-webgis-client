import React from 'react';

import './lib.sass';
import './index.sass';
import './index.html';

import app from 'app';
import {Toolbar} from './ui/Toolbar';
import {InfoPanel} from './ui/InfoPanel';


export class App extends app.Component {
    async componentDidMount() {
        app.config.init(this.config());

        let map = await app.loadMap();
        map.setTarget('map-container');
    }


    config() {
        return null;
    }

    toolbar() {
        return null
    }

    plugins() {
        return null
    }

    render() {
        return (
            <div id='app-wrap'>
                <div id='map-container'/>
                <InfoPanel/>
                <Toolbar>
                    {this.toolbar()}
                </Toolbar>
                {this.plugins()}
            </div>
        );
    }
}

