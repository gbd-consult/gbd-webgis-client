let base = require('./base.config');

let conf = {
    plugins: ['marker', 'identify', 'test'],
    toolbar: ['identify.Button', 'test.Button'],

    appConfig: {

        server: {
            url: 'http://qwc.gbd-consult.de/',
            wms: {
                url: 'http://qwc.gbd-consult.de/cgi-bin/qgis_mapserv.fcgi?map=/var/www/qwc1/projekte/alkishh.qgs',
                layers: 'Flächen (Wohnbauflächen),Grenzen (Wohnbauflächen),Flächen (Sport und Freizeit),Grenzen (Sport und Freizeit),Punkte (Sport und Freizeit),Beschriftungen (Sport und Freizeit),Flächen (Industrie und Gewerbe),Grenzen (Industrie und Gewerbe),Linien (Industrie und Gewerbe),Punkte (Industrie und Gewerbe),Beschriftungen (Industrie und Gewerbe),Linien (Politische Grenzen),Flächen (Gewässer),Grenzen (Gewässer),Linien (Gewässer),Punkte (Gewässer),Beschriftungen (Gewässer),Flächen (Vegetation),Grenzen (Vegetation),Punkte (Vegetation),Beschriftungen (Vegetation),Linien (Topographie),Punkte (Topographie),Flächen (Friedhöfe),Grenzen (Friedhöfe),Flächen (Verkehr),Grenzen (Verkehr),Linien (Verkehr),Punkte (Verkehr),Beschriftungen (Verkehr),Grenzen (Rechtliche Festlegungen),Beschriftungen (Rechtliche Festlegungen),Beschriftungen (Lagebezeichnungen),Flächen (Gebäude),Grenzen (Gebäude),Linien (Gebäude),Punkte (Gebäude),Beschriftungen (Gebäude),Linien (Flurstücke),Beschriftungen (Flurstücke),Grenzen (Flurstücke),Flurstücke,Gewässerbauwerke',
            }
        },

        map: {
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
