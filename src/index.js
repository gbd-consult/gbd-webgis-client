import React from 'react';
import ReactDOM from 'react-dom';

import app from 'app';
import 'ol/ol.css';
import './index.sass';

import theme from './theme';

/*=
    config.plugins
        .map(name => `import ${name} from './plugins/${name}'`)
        .join(';\n')
*/

import Application from './Application';

window.gbdWebgisClient = {

    async main(config, container) {

        let App = <Application
            theme={theme}

            initState={{
                /*=
                    JSON.stringify(config.initState)
                        .slice(1, -1)
                 */
            }}

            plugins={[
                /*=
                    config.plugins
                        .map(name => `new ${name}.Plugin`)
                        .join(',\n')
                 */
            ]}

            ui={<div>
                /*= '<ui.Overlay/>' + config.ui + '<ui.Dialog/>' */
            </div>}
        />;

        if (typeof(config) === 'string') {
            config = await app.http.get(config);
        }

        await app.config.init(config);
        ReactDOM.render(App, container);
    }
};

