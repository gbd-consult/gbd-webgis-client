import React from 'react';
import ReactDOM from 'react-dom';

import ui from './ui';

import './index.sass';
import './index.html';

"@pluginImports"

import App from './App';

class ConfiguredApp extends App {

    ui() {
        return <div>"@ui"</div>;
    }

    plugins() {
        return [ "@pluginComponents" ];
    }
}


ReactDOM.render(<ConfiguredApp/>, document.getElementById('app-container'));


