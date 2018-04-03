var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ZipFilesPlugin = require('webpack-zip-files-plugin');

var BUILD_DIR = path.resolve(__dirname, 'public/build');
var APP_DIR = path.resolve(__dirname, 'views');
const CONFIG_PATH = process.env.CONFIG_PATH || path.resolve(__dirname, './config/pluginbot.config.js');
const PLUGIN_DIR = path.resolve(__dirname, "./plugins");
const MODULES = path.resolve(__dirname, "node_modules");
var APP_DIR2 = path.resolve(__dirname, '.');

var config = async function () {
    let configBuilder = require("pluginbot/config");
    let pluginConfigs = await configBuilder.buildClientConfig(CONFIG_PATH);
    let pluginMap = await configBuilder.buildClientPluginMap(CONFIG_PATH);
    let plugins =
        {
            entry: {
                ...pluginMap
            },
            output: {
                path: BUILD_DIR + "/plugins",
                publicPath: "/build/plugins/",
                filename: '[name].js',
                chunkFilename: '[name]-[id].js',
                library: ["_plugins", "[name]"],
                libraryTarget: "umd"


            },

            module: {
                loaders: [
                    {
                        test: /\.jsx?/,
                        loader: 'babel-loader',
                        include: [PLUGIN_DIR, APP_DIR]

                    },
                    {
                        test: /\.css$/,
                        loader: "style-loader!css-loader"
                    }

                ]
            },

            plugins: [

                // new UglifyJsPlugin(),
                // new webpack.DefinePlugin({
                //     'process.env': {
                //         NODE_ENV: JSON.stringify('production')
                //     }
                // })

            ]
        };

    let app = {
        entry: {
            "bundle": ['react-hot-loader/patch', APP_DIR + '/index.jsx'],


        },
        output: {
            path: BUILD_DIR,
            publicPath: "/build/",
            filename: '[name].js'
        },

        devServer: {
            historyApiFallback: true,
            hot: true,
            contentBase: path.resolve(__dirname, 'public'),
            inline: true,
            host: 'localhost', // Defaults to `localhost`
            port: 3002,
            proxy: {
                '/' : {
                    target: 'http://localhost:3000',
                    secure: false
                },
                '^/api/**': {
                    target: 'http://localhost:3000',
                    secure: false
                },
                '^/setup': {
                    target: 'http://localhost:3000',
                    secure: false
                },
            }
        },
        externals: {
            pluginbot_client_config: JSON.stringify(pluginConfigs),
            _plugins: "_plugins",
        },


        module: {
            loaders: [
                {
                    test: /\.jsx?/,
                    // include : [APP_DIR, APP_DIR2 + "/node_modules\/pluginbot-react", APP_DIR2 + "/node_modules\/pluginbot"],
                    include: [APP_DIR],
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /js[\/\\].+\.(jsx|js)$/,
                    loader: 'imports-loader?jQuery=jquery,$=jquery,this=>window'
                }

            ]
        },
        resolve: {
            alias: {
                'xpluginbot-react': path.resolve(__dirname, 'plugins', 'pluginbot-react')
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),


            new UglifyJsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),

            new ZipFilesPlugin({
                entries: [
                  { src: path.join(__dirname, 'api'), dist: 'api' },
                  { src: path.join(__dirname, 'bin'), dist: 'bin' },
                  { src: path.join(__dirname, 'config'), dist: 'config' },
                  { src: path.join(__dirname, 'lib'), dist: 'lib' },
                  { src: path.join(__dirname, 'middleware'), dist: 'middleware' },
                  { src: path.join(__dirname, 'models'), dist: 'models' },
                  { src: path.join(__dirname, 'public'), dist: 'public' },
                  { src: path.join(__dirname, 'plugins'), dist: 'plugins' },
                  { src: path.join(__dirname, 'uploads'), dist: 'uploads' },
                  { src: path.join(__dirname, 'app.js'), dist: 'app.js' },
                  { src: path.join(__dirname, 'package.json'), dist: 'package.jsson' },
                ],
                output: path.join(__dirname, './dist/servicebot'),
                format: 'tar',
              }),
        ]
    }
    return [ app, plugins]
};


module.exports = config;
