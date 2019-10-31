const webpack = require('webpack')

module.exports = {
  entry: './source/App.js',
  output: {
    path: './public/js/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  }
}
