import Notice from 'web/components/notice/index.grs'

export function macOs () {
  return process.platform === 'darwin'
}

export function windows () {
  return process.platform === 'win32'
}

export function enter (e: KeyboardEvent, cb:Function) {
  (e.key === 'Enter' || e.keyCode === 13) && cb()
}

export function notice (msg: any, type?: string, time?: number) {
  Notice.show(msg, type, time)
}

export function filterCount (n: number) {
  return n > 10000
    ? (n / 10000).toFixed() + '万'
    : n
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