/// create the ol-all stub

const fs = require('fs');
const path = require('path');

const writeIfChanged = require('./write-if-changed');
const allFiles = require('./all-files');


function parts(id) {
    let ls = [], e = id.split('.');

    while (e.length) {
        ls.push(e.join('.'));
        e.pop();
    }

    return ls;
}

function enumMods(root) {
    let ls = {};

    for (let file of allFiles(root)) {
        let text = fs.readFileSync(file, 'utf8'),
            m = text.match(/export\s+default\s+(\w+)/);

        if (!m)
            continue;

        let qname = m[1].slice(4, -1).split('_').join('.');
        if (!qname)
            continue;

        ls[qname] = [m[1], `ol${file.slice(root.length, -3)}`];
    }
    return ls;
}

function enumUsages(root) {
    let ls = {};

    for (let file of allFiles(root)) {
        if (file.includes('ol-all'))
            continue;
        let text = fs.readFileSync(file, 'utf8'),
            m = text.match(/ol(\.\w+)+/g);

        for (let name of m || [])
            ls[name.slice(3)] = 1;
    }

    return Object.keys(ls).sort();
}

function enumImports(mods, usages) {
    let ls = {};

    for (let u of usages) {
        let hasMod = false;
        for (let p of parts(u)) {
            if (p in mods) {
                ls[p] = mods[p];
                hasMod = true;
            } else if (hasMod) {
                ls[p] = null;
            }
        }
    }

    return ls;
}

function genCode(imports) {
    let lines = [];

    lines.push('import ol from "ol";');
    lines.push('export default ol;');
    lines.push('');
    lines.push('');

    for (let u of Object.keys(imports).sort()) {
        if (imports[u]) {
            let [id, pth] = imports[u];
            lines.push(`import ${id} from '${pth}';`);
            lines.push(`ol.${u} = ${id};`);
            lines.push('');
        } else {
            lines.push(`ol.${u} = {};`);
            lines.push('');
        }
    }

    return lines.join('\n');
}

function main(libDir, sourceDir, outPath, generateAll) {
    let mods = enumMods(path.resolve(libDir, 'ol'));
    let usages = generateAll ?
        Object.keys(mods) :
        enumUsages(sourceDir);
    let imports = enumImports(mods, usages);
    let code = genCode(imports);
    writeIfChanged(outPath, code);
}

module.exports = main;