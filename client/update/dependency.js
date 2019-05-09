// 更新网易云音乐接口依赖
const path = require('path')
const musicVersion = 'music-version'
const exec = require('child_process').exec
const currentVersion = require('../../package.json')[musicVersion]

export function needUpdate () {
  if (!version) return Promise.resolve(false)
  return new Promise(resolve => {
    // 检查 NeteaseCloudMusicApi 的 npm 仓库中的包版本
    exec('npm info NeteaseCloudMusicApi version', (err, stdout, stderr) => {
      if(!err) {
        let version = stdout.trim()
        resolve(currentVersion < version)
      } else {
        resolve(false)
      }
    })
  })
}

export function toUpdate () {

}

// 下载网易云接口文件
export async function downAPIfile () {
  // 直接去仓库去拉模板
  const currentAPIUrl = path.resolve(__dirname, '../interface/module')
  const depositoryUrl = 'https://github.com/Binaryify/NeteaseCloudMusicApi/tree/master.zip'
}