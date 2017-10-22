/// replace @placeholders from config

let replacers = {

    pluginImports(cnf) {
        return cnf.build.plugins
            .map(name => `import * as ${name} from './plugins/${name}';`)
            .join('\n');
    },

    ui(cnf) {
        return cnf.build.ui;
    },

    pluginComponents(cnf) {
        return cnf.build.plugins
            .map((name, n) => `<${name}.Plugin key="${name}" />`)
            .join(',\n');
    },

    appTitle(cnf) {
        return cnf.build.title;
    },

    runtimeConfig(cnf) {
        return 'window.APP_CONFIG = ' + JSON.stringify(cnf.runtime, null, 4);
    }

};

function main(tpl, cnf) {
    tpl = tpl.replace(/"@(\w+)"/g, (_, w) => replacers[w](cnf));
    return tpl;
}

module.exports = main;
