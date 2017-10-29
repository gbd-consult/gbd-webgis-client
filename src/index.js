import React from 'react';
import ReactDOM from 'react-dom';

import app from 'app';


import * as colors from 'material-ui/styles/colors';

import 'ol/ol.css';

import './index.sass';
import './index.html';

/*@@@

    config.build.plugins
        .map(name => `import ${name.replace(/-/g, '')} from './plugins/${name}';`)
        .join('\n')
*/

import Application from './Application';

app.config.init(window.APP_CONFIG);


ReactDOM.render(<Application
    theme={{
        /*@@@ config.build.theme */
    }}
    initState={{
        /*@@@ config.build.initState */
    }}
    plugins={[
        /*@@@
            config.build.plugins
            .map(name => `new ${name.replace(/-/g, '')}.Plugin`)
            .join(',\n')
         */
    ]}
    ui={<div>
        /*@@@ config.build.ui */
    </div>}

/>, document.getElementById('app-container'));


