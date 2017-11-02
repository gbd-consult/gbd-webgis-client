/// replace localisation placeholders (__id)

const loaderUtils = require('loader-utils');
const lang = require('./lang');

function loader(content) {
    let options = loaderUtils.getOptions(this);
    let res = lang.process(
        content,
        this.resource,
        options.buildConfig().lang,
        options.baseDir);

    if (!res) {
        return content;
    }

    if (res.errors) {
        res.errors.forEach(err => this.emitWarning(new Error(err)));
    }

    if (res.resources) {
        res.resources.forEach(rpath => {
            this.addDependency(rpath)
        });
    }

    if (res.text) {
        return res.text;
    }

    return content;
}

module.exports = loader;
