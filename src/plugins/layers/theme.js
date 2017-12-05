module.exports = {

    gwc: {
        plugin: {

            layers: {
                panel: {
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                },

                treeContainer: {
                    flex: 1,
                    overflow: 'auto',
                    padding: '8px 8px 8px 0',
                },

                infoContainer: {
                    backgroundColor: 'white',
                    borderTopColor: '{/palette/borderColor}',
                    borderTopStyle: 'solid',
                    borderTopWidth: 2,
                    height: 'auto',
                    overflow: 'auto',
                    padding: 8,
                    textAlign: 'center',
                },

                title: {
                    borderRadius: 10,
                    cursor: 'pointer',
                    lineHeight: '120%',
                    padding: '4px 0',
                },

                titleDisabled: {
                    extend: '{../title}',
                    color: '{/palette/disabledColor}'
                },

                titleHidden: {
                    extend: '{../title}',
                    color: '{/palette/disabledColor}'
                },

                titleSelected: {
                    extend: '{../title}',
                    color: '{/palette/accent1Color}'
                }

            }

        }


    }


}