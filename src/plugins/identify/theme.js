module.exports = {
    gwc: {
        plugin: {
            identify: {
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
                }
            }
        }
    }
};