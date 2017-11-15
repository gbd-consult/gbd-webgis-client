import React from 'react';
import ReactDOM from 'react-dom';

import app from 'app';

import * as colors from 'material-ui/styles/colors';

import 'ol/ol.css';

import './index.sass';

/*=
    config.plugins
        .map(name => `import ${name.replace(/-/g, '')} from './plugins/${name}';`)
        .join('\n')
*/

import Application from './Application';

window.gbdWebgisClient = {

    async main(config, container) {

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

        if(typeof(config) === 'string') {
            config = await app.http.get(config);
        }

        await app.config.init(config);
        ReactDOM.render(App, container);
    }
};

