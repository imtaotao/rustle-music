const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const download = require('download-git-repo')

// 删除文件夹
exports.removeDir = function (dirPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dirPath)) return resolve()
    rimraf(dirPath, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

// 递归创建目录
exports.recursiveMkdir = function (dirPath) {
  const preDirPath = path.dirname(dirPath)
  if (fs.existsSync(preDirPath)) {
    if (fs.existsSync(dirPath)) {
      const stat = fs.statSync(dirPath)
      // 如果当前文件路径已经存在，但是不是文件夹，就重命名为 .bak 结尾的文件
      if (stat && !stat.isDirectory()) {
        fs.renameSync(dirPath, dirPath + '.back')
        fs.mkdirSync(dirPath)
      }
    } else {
      fs.mkdirSync(dirPath)
    }
  } else {
    recursiveMkdir(preDirPath)
  }
}

// 拷贝文件
exports.copyFile = function (from, to) {
  const dirname = path.dirname(to)
  exports.recursiveMkdir(dirname)

  return new Promise((resolve, reject) => {
    const read = fs.createReadStream(from)
    const write = fs.createWriteStream(to)

    read.pipe(write)
    read.on('finish', resolve)
    read.on('error', reject)
  })
}

exports.downLoad = function () {
  
}