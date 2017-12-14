/// build a theme object from plugin themes

const glob = require('glob');
const loaderUtils = require('loader-utils');
const mergeAll = require('./merge-all');

function loader(content) {
    let options = loaderUtils.getOptions(this),
        paths = glob.sync(options.baseDir + '/**/theme.js'),
        res;

    try {
        res = mergeAll(paths, options.buildConfig().theme);
    } catch (e) {
        this.emitError(e);
    }

    if (!res) {
        return content;
    }

    paths.forEach(p => this.addDependency(p));

    return 'export default ' + JSON.stringify(res);
}

module.exports = loader;
