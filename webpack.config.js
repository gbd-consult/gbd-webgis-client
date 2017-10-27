/* eslint-disable */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const merge = require('webpack-merge');
const rimraf = require('rimraf');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC = 'src';
const OUT = 'dist';

let here = (...paths) => path.resolve(__dirname, ...paths);

let defaults = {

    entry: [
        'babel-polyfill',
        here(SRC, 'index.jsx')
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
            'template-loader': './tools/template-loader.js'
        }
    },

    module: {
        loaders: [
            {
                test: here(SRC, 'index'),
                enforce: 'pre',
                loader: 'template-loader'
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
                    }
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
const PrePostPlugin = require('./tools/pre-post-plugin');

function preBuild(appConfig, env) {
    rimraf.sync(here(OUT));
    buildOl(
        here('node_modules'),
        here(SRC),
        here(SRC, 'node_modules/ol-all/index.js'),
        env.build === 'dev');
}

function postBuild(appConfig, env) {

}


let config = function (env) {
    let appConfig = require(here(env.appConfig));
    let c = Object.assign({}, webpackConfigs[env.build]);
    let p = new PrePostPlugin(
        () => preBuild(appConfig, env),
        () => postBuild(appConfig, env)
    );
    c.plugins = [p].concat(c.plugins);
    c.module.loaders[0].options = {appConfig};
    return c;
};

module.exports = config;
