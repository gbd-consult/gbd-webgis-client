/// replace localisation placeholders (__id)

const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const loaderUtils = require('loader-utils');
const mergeAll = require('./merge-all');

let db = null;

const PLACEHOLDER_REGEX = /__\((["'])(.+?)\1\)/g;

function replacePlaceholders(text, language) {
    let missing = [];

    text = text.replace(PLACEHOLDER_REGEX, (c, quote, ref) => {
        let p = ref.replace(/[^.]+$/, language + '.$&'),
            s = _.get(db, p);

        if (!s) {
            missing.push(ref);
            s = ref;
        }

        return JSON.stringify(s);
    });

    return [text, missing];
}

function containsPlaceholders(text) {
    return PLACEHOLDER_REGEX.test(text);
}

function loader(content) {
    if (!containsPlaceholders(content))
        return content;

    let options = loaderUtils.getOptions(this);

    if (!db) {
        let paths = glob.sync(options.baseDir + '/**/lang.js');

        try {
            db = mergeAll(paths, options.buildConfig().lang);
        } catch (e) {
            this.emitError(e);
        }
    }

    this.addDependency(path.resolve(path.dirname(this.resource), 'lang.js'));

    let language = options.buildConfig().language,
        [out, missing] = replacePlaceholders(content, language);

    if (missing) {
        missing.forEach(ref => this.emitWarning(new Error(`no translation for ${language}:"${ref}"`)));
    }

    return out;
}

module.exports = loader;
