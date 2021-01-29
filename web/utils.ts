import Notice from 'web/components/notice/index.grs'

export function enter (e: KeyboardEvent, cb: Function) {
  (e.key === 'Enter' || e.keyCode === 13) && cb()
}

export function notice (msg: any, type?: boolean, time?: number) {
  Notice.show(msg, type, time)
}

export function filterCount (n: number) {
  return n > 10000
    ? (n / 10000).toFixed() + '万'
    : n
}

export function random (max = 1000000, min = 0, fractionDigits = 0) {
  return Number(Math.random() * (max - min) + min).toFixed(fractionDigits)
}

export function getDuration (time: number) {
  const s = time / 1000
  let min = Math.floor(s / 60)
  let sec = Math.floor(s % 60)
  min < 10 && ((<any>min) = '0' + min)
  sec < 10 && ((<any>sec) = '0' + sec)
  return min + ':' + sec
}

export function timestampToTime (timestamp: number) {
  const date = new Date(Number(timestamp))
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  return {year, month, day, hour, min, sec}
}

export function scrollEvent (id: string) {
  if (!window.node.macOs()) return () => {}
  return e => {
    const node:any = document.getElementById(id)
    if (node) {
      const style = node.style
      if (e.target.scrollTop > 50) {
        if (!style.backdropFilter) {
          style.backdropFilter = 'blur(30px)'
        }
      } else if (style.backdropFilter) {
        style.backdropFilter = ''
      }
    }
  }
}

export function throttle(fn: (...args: []) => void, gapTime = 50) {
  let lastTime = 0;
  return function () {
    let nowTime = Date.now()
    if ((nowTime - lastTime) > gapTime || !lastTime) {
      fn()
      lastTime = nowTime
    }
  }
}

export function compared (newProps: Object, oldProps: Object) {
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      return true
    }
  }
  return false
}