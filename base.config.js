/* eslint-disable */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const merge = require('webpack-merge');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackPreBuildPlugin = require('pre-build-webpack');

const SRC = 'src';
const OUT = 'dist';

let here = (...paths) => path.resolve(__dirname, ...paths);

let baseConfig = {

    entry: [
        'babel-polyfill',
        here(SRC, '.generated.index.jsx')
    ],

    output: {
        publicPath: '',
        path: here(OUT),
        filename: 'index.js',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },

    module: {

        loaders: [
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                include: here(SRC),
                loader: 'eslint-loader',
                options: {
                    failOnError: true,
                    failOnWarning: false,
                    cacheDirectory: here('.cache'),
                }
            },
            {
                test: /\.jsx?$/,
                include: here(SRC),
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react'],
                    cacheDirectory: here('.cache'),
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(['css-loader'])
            },
            {
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
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
    plugins: [
        new ExtractTextPlugin({
            filename: 'index.css',
            allChunks: true,
        })
    ],

};

let buildConfigs = {};

buildConfigs.dev = merge(baseConfig, {
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


buildConfigs.prod = merge(baseConfig, {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
        })
    ]
});

const makeIndex = require('./tools/make-index');
const makeOl = require('./tools/make-ol');

function preBuild(appConfig, env) {
    makeIndex(
        here(SRC, 'index.template.jsx'),
        here(SRC, '.generated.index.jsx'),
        appConfig);

    makeOl(
        here('node_modules'),
        here(SRC),
        here(SRC, 'node_modules/ol-all/index.js'),
        env.build === 'dev');
}

let makeConfig = function (appConfig, env) {
    let c = Object.assign({}, buildConfigs[env.build]);
    let p = new WebpackPreBuildPlugin(() => preBuild(appConfig, env));
    c.plugins = [p].concat(c.plugins);
    return c;
};

module.exports = {makeConfig};
