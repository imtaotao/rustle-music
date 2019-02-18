const webpack = require('webpack')
const { resolve, assetsPath } = require('./share')

const js = {
  test: /\.js$/,
  loader: 'babel-loader',
  include: resolve('web'),
}

const ts = {
  test: /\.ts$/,
  loader: ['babel-loader', 'ts-loader'],
  include: resolve('web'),
}

// grs component
const grs = {
  test: /\.grs$/,
  use: [
    'babel-loader',
    {
      loader: 'grass-loader',
      options: {
        needGrass: true,
        lib: '@rustle/grass',
      },
    }
  ],
  include: resolve('web'),
}

// img
const img = {
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: assetsPath('img/[name].[hash:7].[ext]'),
  },
}

// media source
const media = {
  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|ttf)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: assetsPath('media/[name].[hash:7].[ext]'),
  },
}

module.exports = isDev => ({
  entry: {
    app: resolve('./web/index.ts')
  },
  output: {
    filename: '[name].js',
    publicPath: isDev ? '/' : './',
  },
  resolve: {
    extensions: ['.js', '.ts', '.css', '.scss', '.grs', '.json'],
    alias: {'web': resolve('web')},
  },
  module: {
    rules: [js, ts, grs, img, media],
  },
  optimization: {
    noEmitOnErrors: true,
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    new webpack.ProvidePlugin({style: './style.scss'}),
  ],
})