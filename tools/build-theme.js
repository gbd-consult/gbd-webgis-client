/* eslint-disable */

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

let varRe = /{[.\/\w]+}/g;

function hasVars(s) {
    return _.isString(s) && s.match(varRe);
}


function computePath(curr, p) {
    if (p[0] === '/')
        return p;
    return path.normalize(curr + '/' + p);

}

function expandVars(obj, vpath) {
    return _.mapValues(obj, (val, key) => {
        if (hasVars(val)) {
            return val.replace(varRe, $ => '{' +
                computePath(vpath, $.slice(1, -1)) + '}');
        }

        if (_.isArray(val)) {
            return val;
        }

        if (_.isObject(val)) {
            return expandVars(val, vpath + '/' + key);
        }

        return val;
    });
}

function getVar(obj, vpath) {
    try {
        for (let p of vpath.slice(1).split('/')) {
            obj = obj[p]
        }
    } catch (e) {
        throw new Error(`${vpath} not found`);
    }

    if (typeof obj === 'undefined')
        throw new Error(`${vpath} not found`);
    return obj;
}


function _evalStr(root, val) {
    let expr = val;

    while (hasVars(expr)) {
        expr = expr.replace(varRe, $ => {
            let v = getVar(root, $.slice(1, -1));
            return hasVars(v) ? '(' + v + ')' : JSON.stringify(v);
        });
    }

    return eval(expr);
}

function evalStr(root, val) {
    try {
        return _evalStr(root, val);
    } catch (e) {
        throw new Error(e.message + `, expression "${val}"`);
    }
}

function checkExtend(root, val) {
    let v = val.slice(1, -1);
    getVar(root, v);
    return v.slice(1).split('/').join('.');
}

function evalVars(root, obj) {
    return _.mapValues(obj, (val, key) => {

        if (hasVars(val)) {
            if (key === 'extend') {
                return checkExtend(root, val);
            }
            return evalStr(root, val);
        }

        if (_.isArray(val)) {
            return val;
        }

        if (_.isObject(val)) {
            return evalVars(root, val);
        }

        return val;
    });
}

function load(rpath) {
    delete require.cache[rpath];
    return require(rpath);
}

function main(config, sourceDir) {
    let paths = [path.resolve(sourceDir, 'theme.js')],
        errors = [];

    config.plugins.forEach(name => {
        let p = path.resolve(sourceDir, `plugins/${name}/theme.js`);
        if (fs.existsSync(p))
            paths.push(p);
    });

    let themes = [];

    paths.forEach(p => {
        try {
            themes.push(load(p));
        } catch (e) {
            errors.push(new Error(e.message + ' in ' + p));
        }
    });

    themes.push(config.theme || {});

    let theme = _.merge({}, ...themes);

    theme = expandVars(theme, '');

    try {
        theme = evalVars(theme, theme);
    } catch (e) {
        errors.push(e);
    }

    return {
        errors,
        resources: paths,
        out: theme
    }
}

module.exports = main;
