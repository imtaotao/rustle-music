const webpack = require('webpack')
const { port, resolve } = require('./share')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

exports.port = 2333

// css
const css = modules => ({
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules, // 配合 Grass.cssMoudles 方法
        localIdentName: '[local]_[hash:base64:5]',
      },
    },
  ]
})

const sass = {
  test: /\.scss$/,
  use: css(true).use.concat(['resolve-url-loader', 'sass-loader']),
}

const plugins = [
  new FriendlyErrorsPlugin(), // 友好的错误信息输出
  new webpack.HotModuleReplacementPlugin(), // 配合 dev-server 热加载
  new HtmlWebpackPlugin({
    filename: './index.html',
    template: 'entry.html',
  })
]

module.exports = host => ({
  plugins,
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [css(false), sass],
  },
  devServer: {
    port,
    host: host || null, // 192.168.1.103
    hot: true,
    inline: true,
    progress: true,
    allowedHosts: [], // 白名单
    contentBase: resolve('./'),
  },
})