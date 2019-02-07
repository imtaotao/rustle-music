declare module "*.vue" {
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

interface Window {
  onNetWorkError: () => void
  node: {
    request: (router: string, body?: Object) => Promise<RequestResponse>
    getCookie: () => Cookie | null
    setCookie: (cookie: Cookie) => void
    clearCookie: () => void
  }
}

declare var window: Window