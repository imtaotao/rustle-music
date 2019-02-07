const path = require('path')

// 生产环境静态资源打包文件夹名称
const staticDirName = 'assets'

// devserver port
exports.port = 2333
exports.assetsPath = dir=> path.posix.join(staticDirName, dir)
exports.resolve = dir => path.posix.join(__dirname, '..', dir)