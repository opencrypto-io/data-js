const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    filename: 'opencrypto-data.lib.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        use: 'exports-loader?OpencryptoData'
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js($|\?)/i
      })
    ]
  }
}
