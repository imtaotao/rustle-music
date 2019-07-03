const merge = require('webpack-merge')
const baseCfg = require('./webpack/base.config')

module.exports = env => {
  if (env) {
    if (env.dev) {
      return merge(baseCfg(true), require('./webpack/dev.config')(env.host))
    }
    if (env.build) {
      return merge(baseCfg(false), require('./webpack/prod.config')(env.analyzer))
    }
  }
  throw Error('can\'t build')
}