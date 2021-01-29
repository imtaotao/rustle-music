const fs = require('fs')
const url = require('url')
const path = require('path')
const cookie = require('cookie')
const request = require('./util/request')
const cacheManager = require('./cacheManager')
const { cookieToJson } = require('./util/index')

let COOKIES = ''
window.cacheManager = cacheManager

// router
const special = {
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm',
  'daily_signin.js': '/daily_signin',
}

// 需要过滤的缓存的接口
const filterCaches = [
  'personal_fm',
]

const router = {}
fs.readdirSync(path.join(__dirname, 'module')).reverse().forEach(file => {
  if (!file.endsWith('.js')) return
  let question = require(path.join(__dirname, 'module', file))
  let route = file in special
      ? special[file]
      : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')

  router[route] = (_query, body, cookies, cacheKey, cacheTime) => {
    if (typeof _query.cookie === 'string') {
      _query.cookie = cookieToJson(_query.cookie)
    }

    let query = Object.assign(
      {},
      { cookie: cookies },
      _query,
      body,
    )

    return question(query, request)
      .then(answer => {
        const data = {
          body: answer.body,
          status: answer.status,
        }

        if (route.includes('login')) {
          // 登录后保存 cookie
          COOKIES = parseCookie(answer.cookie)
        } else if (route.includes('logout')) {
          // 退出登录后清空 cookie
          COOKIES = ''
        } else if (!filterCaches.some(r => cacheKey.includes(r))) {
          // 设置缓存
          if (!query.body) {
            cacheManager.set(cacheKey, data, cacheTime)
          }
        }
        return data
      })
      .catch(answer => {
        console.log('[ERR]', route, answer)
        if(answer.body.code == '301') {
          answer.body.msg = '需要登录'
        }
        return Promise.reject({
          body: answer.body,
          status: answer.status,
        })
      })
  }
})

exports.request = function (interface, body, cacheTime) {
  const { query, pathname } = url.parse(interface, true)
  if (!router[pathname]) {
    throw new Error('can\'t fount ' + pathname)
  }

  const cacheKey = `${interface}_${JSON.stringify(body)}`
  if (cacheManager.has(cacheKey)) {
    const data = cacheManager.get(cacheKey)
    if (data) {
      return new Promise(resolve => {
        setTimeout(() => resolve(data), 10) // 做一点延时
      })
    }
  }
  return router[pathname](query, body, transformCookie(COOKIES), cacheKey, cacheTime)
}

function parseCookie (cookies) {
  if (Array.isArray(cookies) && cookies.length > 0) {
    const result = {}
    cookies.forEach(val => {
      const parseValue = cookie.parse(val)
      for (let key in parseValue) {
        if (key === 'Path') continue
        result[key] = key === 'Expires'
          ? (new Date(parseValue[key])).getTime()
          : parseValue[key]
      }
    })
    return result
  }
  return ''
}

function transformCookie (originCookie) {
  const newCookie = {}
  if (originCookie) {
    for (let key in originCookie) {
      if (key === 'Expires') continue
      newCookie[key] = originCookie[key]
    }
  }
  return newCookie
}

exports.setCookie = function (cookie) {
  if (!cookie) {
    throw new Error('cookie can\'t set null')
  }
  COOKIES = cookie
}

exports.clearCookie = function () {
  COOKIES = ''
}

exports.getCookie = function () {
  return COOKIES
}