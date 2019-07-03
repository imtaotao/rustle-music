const { assetsPath } = require('./share')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const css = modules => ({
  test: /\.css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: '../../' }, // css -> assets
    },
    {
      loader: 'css-loader',
      options: {
        modules, // 配合 Grass.cssMoudles 方法
        localIdentName: '[local]_[hash:base64:5]',
      },
    }
  ],
})

const sass = {
  test: /\.scss$/,
  use: css(true).use.concat(['resolve-url-loader', 'sass-loader']),
}

// 生成环境 plugins
const plugins = [
  // 提取 css
  new MiniCssExtractPlugin({
    filename: assetsPath('css/[name].[contenthash].css'),
  }),
  new HtmlWebpackPlugin({
    inject: true,
    filename: './index.html',
    template: 'entry.html',
    minify: {
      removeComments: true,
      removeAttributeQuotes: true,
    },
  })
]

// 压缩插件
const minimizer = [
  new UglifyJsPlugin({
    cache: true,
    parallel: true, // 多进程加速
    
  }),
  new OptimizeCSSAssetsPlugin(),
]

const cfg = {
  plugins,
  devtool: false,
  mode: 'production',
  output: {
    filename: assetsPath('js/[name].[chunkhash].js'),
  },
  module: {
    rules: [css(false), sass],
  },
  optimization: {
    minimizer,
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        // node_modules
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    },
    runtimeChunk: {
      name: 'runtime_chunk_code',
    },
  }
}

module.exports = analyzer => {
  if (analyzer) {
    // 打包大小分析
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    cfg.plugins.push(new BundleAnalyzerPlugin())
  }
  return cfg
}