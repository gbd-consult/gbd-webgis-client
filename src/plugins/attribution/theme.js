module.exports = {
    gwc: {
        plugin: {
            attribution: {
                bar: {
                    position: 'absolute',
                    right: 0,
                    bottom: '{/gwc/ui/statusbar/height}',
                    background: 'rgba(0, 0, 0, .1)',
                    color: '#555',
                    fontSize: '{/fontSize/smallest}',
                    fontFamily: '{/fontFamily}',
                    padding: '2px 4px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                },
                link: {
                    color: '{../bar/color}',
                    textDecoration: 'underline'
                },
            }
        }
    }
};