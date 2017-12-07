module.exports = {

    gwc: {
        plugin: {
            details: {
                featureList: {
                    container: {
                        padding: '8px 8px 8px 0',
                    },
                    more: {
                        margin: '0 0 12px 34px',
                        overflow: 'hidden'
                    },
                    maptip: {
                        margin: '12px 0',
                        padding: 6
                    },
                    table: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    tr: {},
                    trEven: {
                    },
                    td: {
                        borderBottomColor: '{/palette/light}',
                        borderBottomStyle: 'solid',
                        borderBottomWidth: 1,
                        fontSize: 14,
                        textAlign: 'left',
                        margin: 0,
                        padding: 8
                    },
                    th: {
                        extend: '{../td}',
                        fontWeight: 800,
                    }
                },
            }
        }
    }
};
