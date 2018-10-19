'use strict';

const hwp = require('html-webpack-plugin');

module.exports = (env) => ({
  entry: './main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   exclude: /node_modules/,
      // }
    ]
  },
  plugins: [
    new hwp({
      filename: 'index.html',
      template: './index-template.html'
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    overlay: true,
    stats: 'minimal',
  }
});
