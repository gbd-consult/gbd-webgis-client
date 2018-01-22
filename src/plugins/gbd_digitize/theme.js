module.exports = {

    gwc: {
        plugin: {

            gbd_digitize: {
                panel: {
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                },

                layers: {
                    flex: 1,
                    overflow: 'auto',
                    padding: '8px 8px 8px 0',
                },

                toolbar: {
                    boxSizing: 'border-box',
                    height: 'auto',
                    overflow: 'visible',
                    padding: '0 8px 8px 0',
                    display: 'flex',
                    width: '100%',
                    backgroundColor: '{/palette/light}'

                },

                toolButton: {
                    normal: {
                        color: '{/palette/textColor}'
                    },
                    active: {
                        color: '{/palette/primary1Color}',
                    },
                    disabled: {
                        color: '{/palette/borderColor}'
                    }
                },

                form: {
                    height: 'auto',
                    overflow: 'auto',
                    padding: 16,
                    borderTop: '1px dotted',
                    borderTopColor: '{/palette/borderColor}'

                },

                tree: {
                    padding: 8,
                    cursor: 'pointer'
                },

                treeSelected: {
                    extend: '{../tree}',
                    color: '{/palette/accent1Color}'
                }

            }

        }
    }
}