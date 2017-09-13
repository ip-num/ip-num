var webpack = require("webpack");
var releaseVersion = require("./package.json").version;

module.exports = {
  entry: './dist/src/index.js',
  output: {
    filename: 'ip-num-' + releaseVersion + ".js",
    library: 'ipnum'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  target: "web",
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  }
};