const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackAutoInject = require('webpack-auto-inject-version')

module.exports = {
  entry: {
    'ocd.lib': './index.js',
    'ocd.lib.min': './index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ocd',
    libraryTarget: 'var'
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/
    })]
  },
  plugins: [
    new WebpackAutoInject({
      SHORT: 'ocd.lib.js',
      SILENT: true,
      components: {
        AutoIncreaseVersion: false
      }
    })
  ]
}
