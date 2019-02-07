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
      options: { modules }, // 配合 Grass.cssMoudles 方法
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
    template: 'index.html',
  })
]

module.exports = {
  plugins,
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [css(false), sass],
  },
  devServer: {
    port,
    hot: true,
    inline: true,
    progress: true,
    allowedHosts: [], // 白名单
    contentBase: resolve('./'),
  },
}