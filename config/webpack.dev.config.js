'use strict';

const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const config = require('../package.json');

let webpackConfig = require('./webpack.base.config.js');

const basePath = path.join(__dirname, '../');
module.exports = function() {
    let myDevConfig = webpackConfig;

    myDevConfig.devtool = 'inline-source-map';
    myDevConfig.cache = true;
    myDevConfig.watch = true;

    myDevConfig.output = {
        path: path.join(basePath), //, 'build/dev'),
        filename: 'plugin.js',
    };

    myDevConfig.module.rules = myDevConfig.module.rules.concat([
        {
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: ['/node_modules/', '/build/'],
        }
    ]);

    myDevConfig.plugins = myDevConfig.plugins.concat([
        new webpack.DefinePlugin({
            'DEBUG': true,
            'version': Date.now()
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            proxy: 'http://localhost:8080',
        }),
    ]);

    return myDevConfig;
};