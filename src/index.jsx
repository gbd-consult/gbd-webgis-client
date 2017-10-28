import React from 'react';
import ReactDOM from 'react-dom';

import * as colors from 'material-ui/styles/colors';

import './index.sass';
import './index.html';

/*@@@

    config.build.plugins
        .map(name => `import ${name.replace(/-/g, '')} from './plugins/${name}';`)
        .join('\n')
*/

import App from './App';


ReactDOM.render(<App
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


