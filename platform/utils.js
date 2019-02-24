exports.macOs = function () {
  return process.platform === 'darwin'
}

exports.windows = function () {
  return process.platform === 'win32'
}