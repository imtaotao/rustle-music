const fs = require('fs')
const path = require('path')
const yarn = require('yargs')
const outDir = './active'

function getIconStr (url, cb) {
  fs.exists(url, exists => {
    if (exists) {
      fs.readFile(url, (err, buffer) => {
        if (!err) {
          cb(buffer.toString())
        }
      })
    }
  })
}

function addColorAttr (iconStr) {
  const splice = (string, start, newStr) => {
    return string.slice(0, start) + newStr + string.slice(start)
  }
  let color = yarn.argv.color
  color = typeof color === 'string'
    ? color
    : '#c4463a'

  return splice(iconString, 5, `style='fill:${color};' `)
}

function setNewIcon (originUrl, iconStr, filename) {
  const path = path.join(originUrl, outDir, filename)
  fs.writeFile(path, iconStr, err => {
    // console.log('[Err]: ' + filename)
    console.log(err);
  })
}