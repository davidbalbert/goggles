var path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: 'goggles.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["es2015"]
        }
      }
    ]
  }
};
