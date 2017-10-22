let loaderUtils = require('loader-utils');

let evalTemplate = require('./eval-template');

function loader(content) {
    let options = loaderUtils.getOptions(this);
    let res = evalTemplate(content, options.appConfig);
    return res;
}

module.exports = loader;
