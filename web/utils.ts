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