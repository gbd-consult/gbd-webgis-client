/// build a theme object from plugin themes

const loaderUtils = require('loader-utils');
const buildTheme = require('./build-theme');

function loader(content) {
    let options = loaderUtils.getOptions(this);

    let res = buildTheme(
        options.buildConfig(),
        options.baseDir);

    if (!res) {
        return content;
    }

    if (res.errors) {
        res.errors.forEach(err => this.emitError(new Error(err)));
    }

    if (res.resources) {
        res.resources.forEach(rpath => {
            this.addDependency(rpath)
        });
    }

    if (res.out) {
        return 'export default ' + JSON.stringify(res.out);
    }

    return content;
}

module.exports = loader;
