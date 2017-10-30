/// example application configuration

module.exports = {

    // build-time configuration
    build: {
        // application title
        title: 'Example App',

        // plugins to include
        plugins: [
            'map', 'ui',
            'details', 'layers', 'marker', 'qgis2',
            'search_alkis',
            'search_nominatim',
            'identify', 'selection',
            'position', 'scalebar', 'rotation',


        ],

        // initial state of the app
        initState: `
            sidebarVisible: false,
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
                <identify.Button />
                <selection.Button />
                <qgis2.PrintButton />
            </ui.Toolbar>
            <ui.Statusbar>
                <position.Control />
                <scalebar.Control />
                <rotation.Control />
            </ui.Statusbar>
            <ui.Searchbox />

        `
    },

    // runtime configuration
    runtime: {

        // qgis server (2 series)
        qgis2: {
            server: 'http://qwc.gbd-consult.de/cgi-bin/qgis_mapserv.fcgi?map=/var/www/qwc1/projekte/alkishh.qgs',
            print: {
                template: 'template1',
                resolution: 300
            }
        },

        // gbd server (2 series)
        server: {
            url: 'http://qwc.gbd-consult.de/',
        },

        // map options
        map: {
            background: 'osm',
            scales: [
                100,
                200,
                250,
                500,
                750,
                1000,
                1500,
                2000,
                2500,
                3000,
                4000,
                5000,
                7500,
                10000,
                12000,
                15000,
                20000,
                25000,
                30000,
                35000,
                40000,
                45000,
                50000,
                75000,
            ],
            center: [
                566067,
                5934682
            ],
            extent: [
                558536,
                5928546,
                572957,
                5937627,
            ],
            crs: {
                server: 'EPSG:25832',
                client: 'EPSG:25832',
                defs: {
                    'EPSG:32632': '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
                    'EPSG:25832': '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs',
                    'EPSG:25833': '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs'

                }
            }
        }
    }
};
