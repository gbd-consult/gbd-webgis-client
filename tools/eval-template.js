/// replace @placeholders from config

let replacers = {

    pluginImports(cnf) {
        return cnf.build.plugins
            .map(name => `import ${name} from './plugins/${name}';`)
            .join('\n');
    },

    ui(cnf) {
        return cnf.build.ui;
    },

    pluginList(cnf) {
        return cnf.build.plugins
            .map(name => `new ${name}.Plugin`)
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
