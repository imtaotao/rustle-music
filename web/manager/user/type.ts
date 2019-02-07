export interface LoginResponse {
  status: number
  body: LoginData
}

// 账号绑定数据
export interface Bindings {
  id: number
  type: number
  url: string
  userId: number
  expired: boolean
  expiresIn: number
  refreshTime: number
  tokenJsonStr: string
}

// 用户核心数据
export interface Profile {
  accountStatus: number
  authStatus: number
  authority: number
  avatarImgId: number
  avatarImgIdStr: string
  avatarImgId_str: string
  avatarUrl: string
  backgroundImgId: 109951162868126480
  backgroundImgIdStr: string
  backgroundUrl: string
  birthday: string
  city: number
  defaultAvatar: boolean
  description: string
  detailDescription: string
  djStatus: number
  eventCount: number
  expertTags: null
  experts: Object
  followed: boolean
  followeds: number
  follows: number
  gender: number
  mutual: boolean
  nickname: string
  playlistBeSubscribedCount: number
  playlistCount: number
  province: number
  remarkName: string | null
  signature: string // 签名
  userId: number
  userType: number
  vipType: number
}

export interface LoginData {
  code: number;
  loginType: number;
  account: {
    id:number
    vipType:number
    userName:string
    createTime:number
  }
  bindings: Bindings[]
  profile: Profile
}

type Cookie = {
  Expires: number
  MUSIC_U: string
  __csrf: string
  __remember_me: string
}