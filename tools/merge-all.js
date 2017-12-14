/* eslint-disable */

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
    try {
        return require(rpath);
    } catch (e) {
        throw new Error(e.message + ` in "${rpath}"`);
    }
}

function main(paths, extra) {
    let objs = paths.map(load);

    if (extra)
        objs.push(extra);

    let all = _.merge({}, ...objs);

    all = expandVars(all, '');
    all = evalVars(all, all);

    return all;
}

module.exports = main;
