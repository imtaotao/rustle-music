import * as U from './type'
import Event from 'web/share/event'
import { notice } from 'web/utils'

function recordState (UserManager: UserManager, body: U.LoginData) {
  UserManager.logged = true
  UserManager.id = body.account.id
  UserManager.birthday = body.profile.birthday
  UserManager.nickname = body.profile.nickname
  UserManager.signature = body.profile.signature
  UserManager.avatarUrl = body.profile.avatarUrl
  UserManager.backgroundImgIdStr = body.profile.backgroundImgIdStr
}

class Login {
  Parent: UserManager
  constructor (Parent) {
    this.Parent = Parent
  }

  private saveRespose (account: string, password: string, type: string) {
    localStorage.setItem('userAccount', JSON.stringify({
      type,
      account,
      password,
      preTime: Date.now(),
    }))
  }

  public phone (phone: string, password: string, autoLogin: boolean) : Promise<U.LoginData> {
    const router = `/login/cellphone?phone=${phone}&password=${password}`
    return window.node.request(router).then((res:U.LoginResponse) => {
      if (autoLogin) {
        this.saveRespose(phone, password, 'phone')
      }
      console.log(res);
      recordState(this.Parent, res.body)
      this.Parent.dispatch('login', res.body)
      return res.body
    })
  }

  public email (email: string, password: string, autoLogin: boolean): Promise<U.LoginData>  {
    const router = `/login?email=${email}&password=${password}`
    return window.node.request(router).then((res:U.LoginResponse) => {
      if (autoLogin) {
        this.saveRespose(email, password, 'email')
      }
      recordState(this.Parent, res.body)
      this.Parent.dispatch('login', res.body)
      return res.body
    })
  }
}

class UserManager extends Event {
  logged = false
  id: number | null
  nickname: string
  signature: string
  avatarUrl: string
  birthday: string
  backgroundImgIdStr: string
  login = new Login(this)

  constructor () {
    super()
    this.init()
  }

  private init () {
    const data = localStorage.getItem('userAccount')
    if (!data) return
    const { type, account, password, preTime } = JSON.parse(data)
    // 30s 之内避免连续自动登录，防止 ip 高频错误
    if (Date.now() - preTime < 30000) return
    this.login[type](account, password, true).catch(err => {
      notice(err)
    })                                                            
  }

  private clearCacheData () {
    // 清空数据
    localStorage.removeItem('userAccount')
    window.node.clearCookie()
  }

  public logout () {
    return window.node.request('/logout').then(res => {
      this.removeInfo()
      this.dispatch('logout', res)
      return res
    })
  }

  public removeInfo () {
    this.id = null
    this.logged = false
    this.nickname = ''
    this.signature = ''
    this.birthday = ''
    this.avatarUrl = ''
    this.backgroundImgIdStr = ''
    this.clearCacheData()
  }

  public getDetail () {
    return !this.logged || this.id == null
      ? Promise.reject('need login')
      : window.node.request(`/user/detail?uid=${this.id}`).catch(() => notice('获取信息失败'))
  }

  public getSubcount () {
    return !this.logged || this.id == null
      ? Promise.reject('need login')
      : window.node.request(`/user/subcount`).catch(() => notice('获取信息失败'))
  }
}

export default new UserManager()