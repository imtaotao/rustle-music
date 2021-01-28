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

