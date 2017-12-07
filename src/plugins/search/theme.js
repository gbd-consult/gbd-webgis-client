module.exports = {
    gwc: {
        plugin: {
            search: {
                buttonColor: '{/palette/primary1Color}',
                buttonColorDisabled: '{/palette/disabledColor}',

                boxAlt: {
                    background: '{/palette/canvasColor}',
                    boxShadow: '{/gwc/ui/shadow}',
                    position: 'relative',
                    width: 300,
                },

                headerPanel: {
                    borderBottomColor: '{/palette/borderColor}',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: 1,
                    boxSizing: 'border-box',
                    display: 'flex',
                    height: 56,
                    padding: '4px 0 0 16px',
                    width: '100%',
                },
                headerAlt: {
                    boxSizing: 'border-box',
                    display: 'flex',
                    height: '{/gwc/ui/sidebar/headerInnerHeight}',
                    padding: '0 0 0 16px',
                    width: '100%',
                },

                textField: {
                    flex: 1,
                },

                resultsPanel: {
                    bottom: 0,
                    left: 0,
                    overflow: 'auto',
                    position: 'absolute',
                    right: 0,
                    top: '{../headerPanel/height}',
                },

                resultsAlt: {
                    borderTopColor: '{/palette/borderColor}',
                    borderTopStyle: 'solid',
                    borderTopWidth: 1,
                    maxHeight: 300,
                    overflow: 'auto',
                },

                result: {
                    cursor: 'pointer',
                    fontSize: '{/fontSize/normal}',
                    padding: '16px 0 8px 16px',
                },

                resultEven: {
                    extend: '{../result}',
                    backgroundColor: '{/palette/light}',
                },

                chip: {
                    borderRadius: 6,
                    float: 'right',
                    fontSize: '{/fontSize/smallest}',
                    marginRight: 6,
                    padding: 2,
                    background: '{/palette/primary1Color}',
                    color: 'white'
                }
            }

        }
    }

}