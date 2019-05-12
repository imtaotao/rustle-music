const fs = require('fs')
const url = require('url')
const path = require('path')
const cookie = require('cookie')
const request = require('./util/request')

let COOKIES = null

// router
const special = {
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm',
  'daily_signin.js': '/daily_signin',
}

const router = {}
fs.readdirSync(path.join(__dirname, 'module')).reverse().forEach(file => {
  if(!(/\.js$/i.test(file))) return

  let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
  let question = require(path.join(__dirname, 'module', file))

  router[route] = (_query, body, cookies) => {
    let query = Object.assign({}, _query, body, {cookie: cookies})
    return question(query, request)
    .then(answer => {
      console.log('[OK]', route)
      return {
        cookie: answer.cookie,
        status: answer.status,
        body: answer.body,
      }
    })
    .catch(answer => {
      console.log('[ERR]', route)
      if(answer.body.code == '301') answer.body.msg = '需要登录'
      return Promise.reject({
        cookie: answer.cookie,
        status: answer.status,
        body: answer.body,
      })
    })
  }
})

function dealWithCookies (cookies) {
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
  return null
}

function sendCookie (originCookie) {
  const newCookie = {}
  if (originCookie) {
    for (let key in originCookie) {
      if (key === 'Expires') continue
      newCookie[key] = originCookie[key]
    }
  }
  return newCookie
}

exports.request = function (interface, body) {
  const { query, pathname } = url.parse(interface, true)
  if (!router[pathname]) {
    throw new Error('can\'t fount ' + pathname)
  }

  return router[pathname](query, body, sendCookie(COOKIES))
  .then(({status, body, cookie}) => {
    if (!COOKIES) {
      COOKIES = dealWithCookies(cookie)
    }
    return { status, body }
  })
}

exports.setCookie = function (cookie) {
  if (!cookie) {
    throw new Error('cookie can\'t set null')
  }
  COOKIES = cookie
}

exports.clearCookie = function () {
  COOKIES = null
}

exports.getCookie = function () {
  return COOKIES
}