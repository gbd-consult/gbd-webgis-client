let cm = require('material-ui/utils/colorManipulator');
let COLOR = require('material-ui/styles/colors');

module.exports = {
    gwc: {
        plugin: {
            marker: {
                feature: {
                    fill: {
                        color: cm.fade(COLOR.purple500, 0.4),
                    },
                    stroke: {
                        color: COLOR.purple500,
                        width: 2
                    }
                },
                pin: {
                    borderRadius: '50%',
                    backgroundColor: COLOR.purple500,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    borderColor: COLOR.purple50,
                    fontSize: 20,
                    padding: 4,
                    color: COLOR.purple50,
                    boxShadow: '{/gwc/ui/shadow}',
                }
            }
        }
    }
};