module.exports = {
    gwc: {
        plugin: {
            scale: {
                indicator: {
                    container: {
                        position: 'absolute',
                        left: '{/gwc/ui/gutter}',
                        bottom: '{/gwc/ui/statusbar/height} + {/gwc/ui/gutter}'
                    },
                    label: {
                        fontFamily: '{/fontFamily}',
                        fontSize: '{/fontSize/smallest}',
                        color: 'black'
                    },
                    bar: {
                        height: 5,
                        borderStyle: 'solid',
                        borderColor: 'black',
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderTopWidth: 0,
                    }
                },
                statusBarIndicator: {
                    bar: {
                        extend: '{../../indicator/bar}',
                        borderColor: '{/gwc/ui/statusbar/color}',
                    }
                }
            }
        }
    }
};