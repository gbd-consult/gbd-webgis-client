module.exports = {
    gwc: {
        plugin: {
            measure: {
                feature: {
                    fill: {
                        color: 'rgba(255,255,255,0.5)'
                    },
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
