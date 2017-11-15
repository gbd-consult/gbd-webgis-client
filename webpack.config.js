/* eslint-disable */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const merge = require('webpack-merge');
const rimraf = require('rimraf');

const SRC = 'src';
const OUT = 'dist';

let here = (...paths) => path.resolve(__dirname, ...paths);

let _buildConfig;

let defaults = {

    entry: [
        'babel-polyfill',
        here(SRC, 'index.js')
    ],

    output: {
        publicPath: '',
        path: here(OUT),
        filename: 'index.js',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },

    resolveLoader: {
        alias: {
            'template-loader': './tools/template-loader.js',
            'lang-loader': './tools/lang-loader.js'
        }
    },

    module: {
        loaders: [
            {
                test: here(SRC, 'index'),
                enforce: 'pre',
                loader: 'template-loader',
                options: {
                    buildConfig: () => _buildConfig
                }
            },
            {
                test: /\.jsx?$/,
                include: here(SRC),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env', 'react'],
                            cacheDirectory: here('.cache'),
                            plugins: ['transform-object-rest-spread', 'lodash']
                        }
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            failOnError: true,
                            failOnWarning: false,
                            cacheDirectory: here('.cache'),
                        }
                    },
                    {
                        loader: 'lang-loader',
                        options: {
                            baseDir: here(SRC),
                            buildConfig: () => _buildConfig
                        }
                    },

                ]
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(sass|scss)$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts/',
                    publicPath: '',
                    name: '[name].[ext]',
                }
            }
        ]
    },
    plugins: []
};

let webpackConfigs = {};

let devIndexTemplate = `
    <!DOCTYPE html>
    <html lang="de">
    
        <head>
            <meta charset="UTF-8">
            <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        </head>
    
        <body>
            <div id="app"></div>
            <script src="index.js"></script>
            <script>window.onload = function() {
                let config = "@@@";
                gbdWebgisClient.main(config, document.getElementById('app')).then(() => console.log('STARTED!'));
            }
            </script>
        </body>
    
    </html>
`;

webpackConfigs.dev = merge(defaults, {
    devServer: {
        hot: true,
        inline: true,
        port: 8080,

        // in the dev mode, assume the runtime config to be in the app dir
        // if the runtime url is `/dev`, take it from the build file
        before(app) {
            app.get('/', function (req, res) {
                if(_buildConfig.configURL === '/dev')
                    r = _buildConfig.runtime;
                else
                    r = require(path.dirname(_buildConfig.env.app) + _buildConfig.configURL);
                let html = devIndexTemplate.replace(/"@@@"/, JSON.stringify(r));
                res.send(html);
            });
        }
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});


webpackConfigs.production = merge(defaults, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
        })
    ]
});


const buildOl = require('./tools/build-ol');


function ConfigPlugin() {
}

ConfigPlugin.prototype.apply = function (compiler) {
    compiler.plugin('compile', function () {
        rimraf.sync(here(OUT));
        buildOl(
            here('node_modules'),
            here(SRC),
            here(SRC, 'node_modules/ol-all/index.js'),
            _buildConfig.env.build === 'dev');
    });
};

let config = function (env) {
    _buildConfig = require(env.app + '.build.js');
    _buildConfig.env = env;

    let c = Object.assign({}, webpackConfigs[env.build]);
    c.plugins = [].concat(
        new ConfigPlugin(),
        c.plugins);

    return c;
};

module.exports = config;
