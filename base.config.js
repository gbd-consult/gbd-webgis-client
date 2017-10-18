const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackPreBuildPlugin = require('pre-build-webpack');

const SRC = 'src';
const OUT = 'dist';

let webpackConfig = {
    entry: path.resolve(__dirname, SRC) + '/.generated.index.tsx',

    output: {
        publicPath: OUT,
        path: path.resolve(__dirname, OUT),
        filename: 'index.js',
    },

    devServer: {
        inline: true,
        port: 8080
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            openlayers: 'openlayers/dist/ol-debug.js'
        }
    },

    module: {

        loaders: [
            {
                test: /\.tsx?$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'awesome-typescript-loader',
                options: {
                    useCache: true,


                }
            },
            // {
            //     test: /\.jsx?$/,
            //     exclude: /node_modules/,
            //     loader: 'babel-loader',
            //     options: {
            //         presets: ['env', 'react'],
            //         cacheDirectory: path.resolve(__dirname, 'cache'),
            //     }
            // },
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
            .join('\n')
    },

    toolbarItems(conf) {
        return conf.toolbar
            .map((tag, n) => `<${tag} key={${n}}/>`)
            .join(',\n')
    },

    pluginComponents(conf) {
        return conf.plugins
            .map((name, n) => `<${name}.Plugin key={${n}} />`)
            .join(',\n')
    },

    appConfig(conf) {
        return JSON.stringify(conf.appConfig, null, 4)
    }
}

function preBuild(conf) {
    let dir = path.resolve(__dirname, SRC);

    let srcPath = dir + '/index.template.tsx';
    let dstPath = dir + '/.generated.index.tsx';

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
