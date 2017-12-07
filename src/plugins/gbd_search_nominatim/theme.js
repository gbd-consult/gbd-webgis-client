let COLOR = require('material-ui/styles/colors');

module.exports = {
    gwc: {
        plugin: {
            search: {
                chipOSM: {
                    extend: '{../chip}',
                    color: COLOR.white,
                    background: COLOR.pink700
                }
            }
        }
    }
};
