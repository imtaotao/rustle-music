export function macOs () {
  return process.platform === 'darwin'
}

export function windows () {
  return process.platform === 'win32'
}