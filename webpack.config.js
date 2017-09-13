var webpack = require("webpack");
var WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  entry: './dist/src/index.js',
  output: {
    filename: 'ip-num.js',
    library: 'ipnum'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  target: "web",
  plugins: [
    new WebpackAutoInject({
      SHORT: 'ip-num',
      components: {
        InjectAsComment: true,
        AutoIncreaseVersion: false
      },
      componentsOptions: {
        InjectAsComment: {
          tag: 'Version: {version}. Released on: {date}',
          dateFormat: 'dddd, mmmm dS, yyyy, h:MM:ss TT'
          }
      }
    })
  ],
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  }
};