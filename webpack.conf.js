const path = require('path'),
  webpack = require('webpack'),
  config = require('./config');

module.exports = {
  devtool: 'source-map',
  entry: path.join(__dirname, 'src/App.jsx'),
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff&name=../libs/[name]/[hash].[ext]"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?limit=1000&name=../libs/[name]/[hash].[ext]"
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=1000&name=../libs/[name]/[hash].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            'env',
            'react',
            'stage-2'
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            'lodash'
          ]
        }
      }
    ]
  }
};