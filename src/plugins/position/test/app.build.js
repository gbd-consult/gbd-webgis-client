module.exports = {

    lang: 'en',
    title: 'Test!',
    configURL: '/dev',

    plugins: [
        'map', 'ui',
        'position'
    ],

    ui: `
        <position.Control />
    `,

    runtime: {
        "map": {
            "background": "osm",
            "scales": [
                3779.5
            ],
            "center": [
                12345,
                56789
            ],
            "crs": {
                "server": "EPSG:3857",
                "client": "EPSG:3857",
                "defs": {}
            }
        }
    }

};


