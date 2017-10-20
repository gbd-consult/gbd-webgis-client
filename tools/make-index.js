/// create index based on plugins config

const path = require('path');
const fs = require('fs');

const writeIfChanged = require('./write-if-changed');

let replacers = {

    pluginImports(ac) {
        return ac.plugins
            .map(name => `import * as ${name} from './plugins/${name}';`)
            .join('\n');
    },

    toolbarItems(ac) {
        return ac.toolbar
            .map((tag, n) => `<${tag} key={${n}}/>`)
            .join(',\n');
    },

    pluginComponents(ac) {
        return ac.plugins
            .map((name, n) => `<${name}.Plugin key="${name}" />`)
            .join(',\n');
    },

    appConfig(ac) {
        return JSON.stringify(ac.runtimeConfig, null, 4);
    }
};

function processTemplate(tpl, appConfig) {
    tpl = tpl.replace(/\/\/\s+@(\w+)/g, (_, w) => replacers[w](appConfig));
    return tpl;
}

function main(srcPath, outPath, appConfig) {
    writeIfChanged(outPath, processTemplate(
        fs.readFileSync(srcPath, 'utf8'),
        appConfig
    ));
}

module.exports = main;
