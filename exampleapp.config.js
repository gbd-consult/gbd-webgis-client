/// example application configuration

module.exports = {

    // build-time configuration
    build: {
        // application title
        title: 'Example App',

        // plugins to include
        plugins: ['ui', 'demo', 'details', 'layers', 'marker', 'wfs', 'wms',
            'selection', 'position',
            'search_alkis',
            'search_nominatim',


        ],

        // initial state of the app
        initState: `
            sidebarVisible: true,
            sidebarActivePanel: 'layers',
            appWaiting: false,
            toolbarVisible: true,
            detailsContent: 'hey!'
        `,

        // application theme, use colors. for mui colors
        theme: `
            palette: {
                textColor: colors.cyan500,
            }
        `,

        // application ui (must be valid JSX)
        ui: `
            <ui.Sidebar>
                <details.Panel key="details" title="Info" />
                <layers.Panel key="layers" title="Layers" />
            </ui.Sidebar>
            <ui.Toolbar>
                <wfs.ListButton />
                <wfs.IdentifyButton />
                <selection.Button />
            </ui.Toolbar>
            <ui.Statusbar>
                <position.Control />
            </ui.Statusbar>
            <ui.Searchbox />

        `
    },

    // runtime configuration
    runtime: {

        wfs: {
            server: 'http://qwc.gbd-consult.de/cgi-bin/qgis_mapserv.fcgi?map=/var/www/qwc1/projekte/alkishh.qgs',
            flavor: 'qgis'
        },

        wms: {
            server: 'http://qwc.gbd-consult.de/cgi-bin/qgis_mapserv.fcgi?map=/var/www/qwc1/projekte/alkishh.qgs',
            flavor: 'qgis'
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
            extent: [
                1102426,
                7089623,
                1120350,
                7079686
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
