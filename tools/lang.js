const fs = require('fs');
const path = require('path');

const allFiles = require('./all-files');

const RESOURCE_FILENAME = 'lang.js';

function DB(baseDir) {
    let d = {};

    allFiles(baseDir)
        .filter(p => path.basename(p) === RESOURCE_FILENAME)
        .forEach(p => d[path.dirname(p)] = require(p));

    this.baseDir = baseDir;
    this.modules = d;
}

DB.prototype.resources = function (fpath) {
    let dir = path.dirname(fpath),
        rs = [];

    for (; ;) {
        if (dir in this.modules)
            rs.push(dir + '/' + RESOURCE_FILENAME);
        if (dir === this.baseDir)
            break;
        dir = path.resolve(path.join(dir, '..'));
    }

    return rs;
};

function _merge(a, b) {
    Object.keys(b).forEach(lang => {
        a[lang] = Object.assign({}, b[lang], a[lang] || {});
    });
    return a;
}

DB.prototype.data = function (fpath) {
    let resources = this.resources(fpath),
        strings = {};

    resources.forEach(rpath => {
        strings = _merge(strings, this.modules[path.dirname(rpath)] || {});
    });

    return {resources, strings};
};

//

const PLACEHOLDER_REGEX = /__\((["'])(.+?)\1\)/g;

function replacePlaceholders(text, strings) {
    let missing = [];

    text = text.replace(PLACEHOLDER_REGEX, (_, quote, symbol) => {
        let s = strings[symbol];
        if (!s) {
            missing.push(symbol);
            s = symbol;
        }
        return JSON.stringify(s);
    });

    return [text, missing];
}

function containsPlaceholders(text) {
    return PLACEHOLDER_REGEX.test(text);
}

//

let _cache = {};


function process(text, fpath, lang, baseDir) {
    if (!containsPlaceholders(text))
        return;

    if (!_cache[baseDir])
        _cache[baseDir] = new DB(baseDir);

    let data = _cache[baseDir].data(fpath);

    if (!data.strings)
        return;

    if (!data.strings[lang]) {
        return {
            errors: [`no translations for "${lang}"`]
        }
    }

    let [out, missing] = replacePlaceholders(text, data.strings[lang]);

    return {
        errors: missing.map(symbol => `no translation for "${symbol}"`),
        resources: data.resources,
        text: out
    }
}

module.exports = {process};
