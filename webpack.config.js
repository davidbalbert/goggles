require('dotenv').config();

var webpack = require('webpack');
var path = require('path');

var definePlugin = new webpack.DefinePlugin({
  __RC_API_BASE__: JSON.stringify(process.env.RC_API_BASE || 'https://www.recurse.com'),
});

module.exports = {
  entry: {
    content: './src/content.js',
    background: './src/background.js',
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["es2015"],
          plugins: ["transform-object-rest-spread"],
        }
      }
    ]
  },
  plugins: [definePlugin]
};
