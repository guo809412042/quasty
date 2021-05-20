/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2019-11-21 20:29:22
 * @LastEditTime: 2020-09-04 11:08:26
 * @LastEditors: ssssslf
 */
/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
    open: true,
    compress: true,
    progress: true,
    proxy: {
      '/': {
        target: 'http://vcm-qa.quvideo.vip',
        changeOrigin: true,
      },
    },
  },
  devtool: 'cheap-module-eval-source-map',
};

module.exports = merge(baseConfig, devConfig);
