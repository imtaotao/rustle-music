declare module "*.grs" {
  import Grass from '@rustle/grass'
  export default Grass.Component
}

type Cookie = {
  Expires: number
  MUSIC_U: string
  __csrf: string
  __remember_me: string
}

type RequestResponse = {
  status:number
  body:any
}

type Update = {
  toUpdate: Function
  needUpdate: Promise<boolean>
}

interface Window {
  onNetworkError: () => void
  clipboard: (text: string) => void;
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

declare var window: Window