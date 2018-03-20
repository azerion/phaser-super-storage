'use strict';
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require(
    'fork-ts-checker-notifier-webpack-plugin'
);
var DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
const HappyPack = require('happypack');
const basePath = path.join(__dirname, '../');
const config = require('../package.json');
let webpackConfig = require('./webpack.base.config.js');
module.exports = function (env) {
    let myDevConfig = webpackConfig;
    myDevConfig.devtool = 'source-map';
    myDevConfig.output = {
        path: path.join(basePath, 'build'),
        library: 'PhaserSuperStorage',
        libraryTarget: 'umd',
        filename: config.config.name + '.min.js',
    };
    myDevConfig.module.rules = myDevConfig.module.rules.concat([
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: ['/node_modules/', '/build/'],
            }
        ]
    );
    myDevConfig.plugins = myDevConfig.plugins.concat([
            new webpack.DefinePlugin({
                    'DEBUG': false,
                    'version': JSON.stringify(config.version)
                }
            ),
            new CleanWebpackPlugin([path.join(basePath, 'build')], {
                    root: basePath
                }
            ),
            //new DeclarationBundlerPlugin({
            //    moduleName:'PhaserSuperStorage',
            //    out: path.join(basePath, 'build', config.config.name + '.min.js'),
            //}),
            new ForkTsCheckerNotifierWebpackPlugin({alwaysNotify: true}),
            new ForkTsCheckerWebpackPlugin({
                    checkSyntacticErrors: true,
                    tslint: path.join(basePath, 'tslint.json'),
                    tsconfig: path.join(basePath, 'tsconfig.json')
                }
            ),
            //new webpack.optimize.UglifyJsPlugin({
            //        exclude: /\/node_modules/,
            //        compress: {
            //            sequences: true,
            //            dead_code: true,
            //            conditionals: true,
            //            booleans: true,
            //            unused: true,
            //            if_return: true,
            //            join_vars: true,
            //            drop_console: true,
            //        },
            //        mangle: false,
            //        sourceMap: true
            //    }
            //),
        ]
    );
    return myDevConfig;
};