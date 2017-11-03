let conf = require('./app.build.js');

let X = String(conf.runtime.map.center[0]),
    Y = String(conf.runtime.map.center[1]);

module.exports = {

    'shows correct init coordinates': $ => {
        $.url($.launch_url);
        $.waitForElementVisible('body', 1000);
        $.assert.value('#positionX', X);
        $.assert.value('#positionY', Y);
    },

    'changes on movement': $ => {
        $.moveToElement('#map-container', 100, 100);
        $.getValue('#positionX', r =>
            $.assert.notEqual(r.value, X));
        $.getValue('#positionY', r =>
            $.assert.notEqual(r.value, Y));
    },

    'done': $ => $.end()

};

