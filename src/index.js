import React from 'react';
import ReactDOM from 'react-dom';

import app from 'app';

import * as colors from 'material-ui/styles/colors';

import 'ol/ol.css';

import './index.sass';
import './index.html';

/*=
    config.plugins
        .map(name => `import ${name.replace(/-/g, '')} from './plugins/${name}';`)
        .join('\n')
*/

import Application from './Application';

function main() {

    let App = <Application
        theme={{
            /*= config.theme */
        }}

        initState={{
            /*= config.initState */
        }}

        plugins={[
            /*=
                config.plugins
                .map(name => `new ${name.replace(/-/g, '')}.Plugin`)
                .join(',\n')
             */
        ]}

        ui={<div>
            /*= config.ui */
        </div>}

    />;

    let configURL = "/*= config.configURL */";

    app.http.get(configURL)
        .then(s => app.config.init(s))
        .then(s => ReactDOM.render(App, document.getElementById('app-container')))
}

main()