import 'web/components/root'
import 'web/components/global'
import { notice } from 'web/utils'
import 'web/assets/icon-font/icomoon/style'

declare global {
  interface Window {
    onNetworkError: () => void
    require: (Module: string) => any
    clipboard: (text: string) => void
    node: {
      update: Update
      macOs: () => boolean
      windows: () => boolean
      clearCookie: () => void
      getCookie: () => Cookie | null
      setCookie: (cookie: Cookie) => void
      request: (router: string, body?: Object) => Promise<RequestResponse>
    }
  }
}

window.onNetworkError = () => {
  notice('网络错误')
}