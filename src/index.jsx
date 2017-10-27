import React from 'react';
import ReactDOM from 'react-dom';

import ui from './ui';

import './index.sass';
import './index.html';

"@pluginImports"

import App from './App';


ReactDOM.render(<App

    plugins={[ "@pluginList" ]}
    ui={<div>"@ui"</div>}

/>, document.getElementById('app-container'));


