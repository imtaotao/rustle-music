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

function addColorAttr (iconStr, color) {
  return iconStr.replace(/<svg/g, `<svg fill="${color}"`)
}

function setNewIcon (originUrl, iconStr, filename) {
  const url = path.join(originUrl, outDir, filename)
  fs.writeFile(url, iconStr, err => {
    err
      ? console.log('[Err]: ' + filename)
      : console.log('[Sus]: ' + filename)
  })
}

function init (files) {
  let color = yarn.argv.color
  color = typeof color === 'string'
    ? color
    : '#c4463a'

  const process = files => {
    files.forEach(file => {
      if (/\.svg$/.test(file)) {
        getIconStr(path.join(__dirname, file), iconStr => {
          setNewIcon(__dirname, addColorAttr(iconStr, color), file)
        })
      }
    })
  }
  if (files && files.length) {
    process(files)
  } else {
    fs.readdir(__dirname, (err, files) => {
      if (err) throw err
      process(files)
    })
  }
}

init()