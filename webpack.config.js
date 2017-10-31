/* eslint-disable */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const merge = require('webpack-merge');
const rimraf = require('rimraf');

const SRC = 'src';
const OUT = 'dist';

let here = (...paths) => path.resolve(__dirname, ...paths);

let _globalAppConfig;

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
                    appConfig: () => _globalAppConfig
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
                            plugins: ['transform-object-rest-spread']
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
                            appConfig: () => _globalAppConfig
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
                test: /\.html$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                }
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

webpackConfigs.dev = merge(defaults, {
    devServer: {
        hot: true,
        inline: true,
        port: 8080
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});


webpackConfigs.prod = merge(defaults, {
    plugins: [
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
            _globalAppConfig.env.build === 'dev');
    });
};

let config = function (env) {
    _globalAppConfig = require(here(env.appConfig));
    _globalAppConfig.env = env;

    let c = Object.assign({}, webpackConfigs[env.build]);
    c.plugins = [].concat(
        new ConfigPlugin(),
        c.plugins);

    return c;
};

module.exports = config;
