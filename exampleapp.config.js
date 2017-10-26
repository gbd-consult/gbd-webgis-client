/// example application configuration

module.exports = {

    // build-time configuration
    build: {
        // application title
        title: 'Example App',

        // plugins to include
        plugins: ['demo', 'marker', 'position', 'infopanelToggle', 'menu'],

        // application ui (must be valid JSX)
        ui: `
            <ui.Searchbar>
                <menu.Button />
                <infopanelToggle.Button />
                <infopanelToggle.Button />
            </ui.Searchbar>
            <ui.Toolbar>
                <demo.Button />
            </ui.Toolbar>
            <position.Control />
            <ui.InfoPanel />
        `
    },

    // runtime configuration
    runtime: {

        // qgis server (2 series)
        qgis2: {
            server: 'http://qwc.gbd-consult.de/cgi-bin/qgis_mapserv.fcgi',
            map: '/var/www/qwc1/projekte/alkishh.qgs'
        },

        // gbd server (2 series)
        server: {
            url: 'http://qwc.gbd-consult.de/',
        },

        // map options
        map: {
            background: 'osm',
            zoom: {
                init: 14,
                min: 10,
                max: 28
            },
            center: [
                1112420,
                7085510
            ],
            crs: {
                server: 'EPSG:32632',
                client: 'EPSG:3857',
                defs: {
                    'EPSG:32632': '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
                }
            }
        }
    }
};
