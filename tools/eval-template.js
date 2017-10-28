/// evaluate build-time code in templates

function main(tpl, config) {
    tpl = tpl.replace(/\/\*@@@([\s\S]+?)\*\//g, (_, code) => eval(code));
    return tpl;
}

module.exports = main;
