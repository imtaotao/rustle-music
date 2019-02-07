const opn = require('opn')
const {
  request,
  setCookie,
  getCookie,
  clearCookie,
} = require('./cloud-music')

// 暴露给渲染进程的 node api
process.once('loaded', function () {
  global.node = {
    setCookie,
    getCookie,
    clearCookie,
    request (router, body) {
      if (navigator.onLine) {
        return request(router, body)
      }
      global.onNetworkError && global.onNetworkError()
      return Promise.reject('network error')
    },
    openBrowser (url) {
      url && opn(url)
    }
  }
})