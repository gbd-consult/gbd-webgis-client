/* eslint-disable */

let base = require('./base.config');

let conf = {
    plugins: ['marker', 'identify', 'test'],
    toolbar: ['identify.Button', 'test.Button'],

    appConfig: {

        qgis: {
            server: 'http://qwc.gbd-consult.de/cgi-bin/qgis_mapserv.fcgi',
            map: '/var/www/qwc1/projekte/alkishh.qgs'

        },

        server: {
            url: 'http://qwc.gbd-consult.de/',
        },

        map: {
            background: 'osm',
            zoom: 16,
            center: {
                lon: 10.001389,
                lat: 53.565278
            },
            proj: {
                server: 'EPSG:32632',
                client: 'EPSG:3857',
                defs: {
                    'EPSG:32632': '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
                }
            }
        }
    }
};

module.exports = base.makeConfig(conf);
