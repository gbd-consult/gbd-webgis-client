let loaderUtils = require('loader-utils');

function evalTemplate(tpl, config) {
    tpl = tpl.replace(/\/\*@@@([\s\S]+?)\*\//g, (_, code) => eval(code));
    return tpl;
}

function loader(content) {
    let options = loaderUtils.getOptions(this);
    let res = evalTemplate(content, options.appConfig());
    return res;
}

module.exports = loader;
