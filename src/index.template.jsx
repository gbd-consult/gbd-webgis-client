import React from 'react';
import ReactDOM from 'react-dom';

// @pluginImports


import {App} from './App';

class ConfiguredApp extends App {

    toolbar() {
        return [
            // @toolbarItems
        ]

    }

    plugins() {
        return [
            // @pluginComponents
        ]

    }

    config() {
        return // @appConfig


    }


}


ReactDOM.render(<ConfiguredApp/>, document.getElementById('app-container'));


