/* eslint-disable */

const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackPreBuildPlugin = require('pre-build-webpack');

const SRC = 'src';
const OUT = 'dist';

let here = p => path.resolve(__dirname, p);


let webpackConfig = {
    entry: [
        'babel-polyfill',
        './' + SRC + '/.generated.index.jsx'
    ],

    output: {
        publicPath: OUT,
        path: here(OUT),
        filename: 'index.js',
    },

    devServer: {
        inline: true,
        port: 8080
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },

    devtool: 'cheap-eval-source-map',

    module: {

        loaders: [
            // {
            //     test: /\.tsx?$/,
            //     exclude: path.resolve(__dirname, 'node_modules'),
            //     loader: 'awesome-typescript-loader',
            //     options: {
            //         useCache: true,
            //
            //
            //     }
            // },
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                exclude: here('node_modules'),
                loader: 'eslint-loader',
                options: {
                    failOnError: true,
                    failOnWarning: false,
                    cacheDirectory: here('.cache'),
                }

            },
            {
                test: /\.jsx?$/,
                exclude: here('node_modules'),
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

let replacers = {

    pluginImports(conf) {
        return conf.plugins
            .map(name => `import * as ${name} from './plugins/${name}';`)
            .join('\n');
    },

    toolbarItems(conf) {
        return conf.toolbar
            .map((tag, n) => `<${tag} key={${n}}/>`)
            .join(',\n');
    },

    pluginComponents(conf) {
        return conf.plugins
            .map((name, n) => `<${name}.Plugin key={${n}} />`)
            .join(',\n');
    },

    appConfig(conf) {
        return JSON.stringify(conf.appConfig, null, 4);
    }
};

function preBuild(conf) {
    let dir = path.resolve(__dirname, SRC);

    let srcPath = dir + '/index.template.jsx';
    let dstPath = dir + '/.generated.index.jsx';

    let src = fs.readFileSync(srcPath, 'utf8');
    let dst = '';

    try {
        dst = fs.readFileSync(dstPath, 'utf8');
    } catch (e) {
    }

    src = src.replace(/\/\/\s+@(\w+)/g, (_, w) => replacers[w](conf));

    if (src !== dst)
        fs.writeFileSync(dstPath, src);
}

let makeConfig = function (conf) {
    let c = Object.assign({}, webpackConfig);
    let p = new WebpackPreBuildPlugin(() => preBuild(conf));
    c.plugins = [p].concat(c.plugins);
    return c;
};

module.exports = {makeConfig};
