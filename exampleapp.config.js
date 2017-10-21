/* eslint-disable */

let base = require('./base.config');

let appConfig = {
    plugins: ['marker', 'identify', 'test', 'position'],
    toolbar: ['identify.Button', 'test.Button', 'position.Control'],

    runtimeConfig: {

        qgis2: {
            server: 'http://qwc.gbd-consult.de/cgi-bin/qgis_mapserv.fcgi',
            map: '/var/www/qwc1/projekte/alkishh.qgs'

        },

        server: {
            url: 'http://qwc.gbd-consult.de/',
        },

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

module.exports = env => base.makeConfig(appConfig, env);
