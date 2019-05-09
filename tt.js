const download = require('download-git-repo')

download('https://github.com/Binaryify/NeteaseCloudMusicApi', './abc', err => {
  if (err) console.log(err)
})