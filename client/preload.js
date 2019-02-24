const opn = require('opn')
const { macOs, windows } = require('../platform/utils')
const {
  request,
  setCookie,
  getCookie,
  clearCookie,
} = require('./interface')
const clipboard = require('electron').clipboard

// 暴露给渲染进程的 node api
process.once('loaded', function () {
  global.node = {
    macOs,
    windows,
    setCookie,
    getCookie,
    clearCookie,
    request (router, body) {
      if (navigator.onLine) {
        return request(router, body)
      }
      global.onNetworkError && global.onNetworkError()
      const res = {body: {msg: '网络错误'}}
      return Promise.reject(res)
    },
    openBrowser (url) {
      url && opn(url)
    },
    clipboard (text) {
      return clipboard.writeText(text)
    }
  }
})