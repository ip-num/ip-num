const webpack = require("webpack");
const pkg = require("./package.json");

module.exports = {
  entry: './dist/src/index.js',
  output: {
    filename: './ip-num.js',
    library: 'ipnum'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  target: "web",
  plugins: [
    new webpack.BannerPlugin({
      banner: `Version: ${pkg.version}. Released on: ${new Date().toUTCString()}`,
      raw: false,
      entryOnly: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  }
};