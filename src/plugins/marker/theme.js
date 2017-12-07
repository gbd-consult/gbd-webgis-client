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
                },
                popup: {
                    position: 'absolute',
                    bottom: '{/gwc/ui/statusbar/height} + {/gwc/ui/gutter}',
                    left: '{/gwc/ui/gutter}',
                    maxWidth: 232,
                    padding: '30px 16px 16px 16px',
                    fontSize: '{/fontSize/small}'
                },
                popupCloseButton: {
                    position: 'absolute',
                    fontSize: 16,
                    padding: 8,
                    right: 0,
                    top: 0,
                    cursor: 'pointer'
                }

            }
        }
    }
};