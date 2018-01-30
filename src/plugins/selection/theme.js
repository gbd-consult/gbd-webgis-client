module.exports = {
    gwc: {
        plugin: {
            selection: {
                feature: {
                    stroke: {
                        color: 'red',
                        lineDash: [4, 4],
                        width: 3
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
