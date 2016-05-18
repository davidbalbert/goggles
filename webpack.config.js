var fs = require('fs');

function fileExists(path) {
  try {
    fs.accessSync(path, fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

// dotenv throws an error if the file doesn't exist
if (fileExists(".env")) {
  require('dotenv').config();
}

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
          plugins: [
            // es2015 presets without transform-regenerator
            "check-es2015-constants",
            "transform-es2015-arrow-functions",
            "transform-es2015-block-scoped-functions",
            "transform-es2015-block-scoping",
            "transform-es2015-classes",
            "transform-es2015-computed-properties",
            "transform-es2015-destructuring",
            "transform-es2015-duplicate-keys",
            "transform-es2015-for-of",
            "transform-es2015-function-name",
            "transform-es2015-literals",
            "transform-es2015-modules-commonjs",
            "transform-es2015-object-super",
            "transform-es2015-parameters",
            "transform-es2015-shorthand-properties",
            "transform-es2015-spread",
            "transform-es2015-sticky-regex",
            "transform-es2015-template-literals",
            "transform-es2015-typeof-symbol",
            "transform-es2015-unicode-regex",

            // additional plugins
            "transform-object-rest-spread",
            "transform-async-to-generator"
          ]
        }
      }
    ]
  },
  plugins: [definePlugin]
};
