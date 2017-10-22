///

const fs = require('fs');

function main(path, text) {
    let old = null;

    try {
        old = fs.readFileSync(path, 'utf8');
    } catch(e) {
    }

    if(text !== old) {
        fs.writeFileSync(path, text);
    }
}

module.exports = main;
