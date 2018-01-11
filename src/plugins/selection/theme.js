module.exports = {
    gwc: {
        plugin: {
            selection: {
                feature: {
                    stroke: {
                        color: 'black',
                        lineDash: [4, 4],
                        width: 2
                    }
                },
                tooltip: {
                    position: 'relative',
                    fontFamily: '{/fontFamily}',
                    fontSize: '{/fontSize/smallest}',
                    padding: 5,
                    background: '{../feature/stroke/color}',
                    color: 'white',
                }
            }
        }
    }
};
