
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
      const res = {body: {msg: 'network error'}}
      return Promise.reject(res)
    },
    openBrowser (url) {
      url && opn(url)
    }
  }
})