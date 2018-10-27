'use strict';

const hwp = require('html-webpack-plugin');

module.exports = (env) => ({
  mode: env.development ? 'development' : 'production',
  entry: './main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new hwp({
      filename: 'index.html',
      template: './start.html'
    })
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    overlay: true,
    stats: 'minimal',
    // proxy: {
    //   '/jquery-2.2.4.min.js': {
    //     target: 'http://code.jquery.com'
    //   }
    // }
  }
});
