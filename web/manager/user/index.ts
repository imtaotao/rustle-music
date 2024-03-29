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

  private clearAutoLoginData () {
    localStorage.removeItem('userAccount')
  }

  public phone (phone: string, password: string, autoLogin: boolean) : Promise<U.LoginData> {
    const router = `/login/cellphone?phone=${phone}&password=${password}`
    return window.node.request(router).then((res:U.LoginResponse) => {
      autoLogin
        ? this.saveRespose(phone, password, 'phone')
        : this.clearAutoLoginData()

      localStorage.setItem('id', String(res.body.account.id))
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

  private mockLogin() {
    const id = localStorage.getItem('id')
    if (process.env)
    if (id) {
      this.id = +id
      this.logged = true
      this.nickname = '*_和声_伴奏'
    }
  }

  private init () {
    // this.mockLogin() // 测试时使用
    // return
    const data = localStorage.getItem('userAccount')
    if (!data) return
    const { type, account, password, preTime } = JSON.parse(data as string)
    // 30s 之内避免连续自动登录，防止 ip 高频错误
    if (Date.now() - preTime < 30000) {
      notice('登录频率过高')
      return
    }
    this.login[type](account, password, true).catch(err => {
      console.log(err);
      notice(err.body.msg)
    })                                                            
  }

  private clearCacheData () {
    // 清空数据
    localStorage.removeItem('userAccount')
    window.node.clearCookie()
  }

  private check (cb: Function) {
    if (!this.logged || this.id == null) {
      notice('需要登录')
      return Promise.reject('need login')
    }
    return cb()
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
    return this.check(() => {
      return window.node.request(`/user/detail?uid=${this.id}`)
      .catch(() => notice('获取信息失败'))
    })
  }

  public getSubcount () {
    return this.check(() => {
      return window.node.request(`/user/subcount`)
      .catch(() => notice('获取信息失败'))
    })
  }

  public getSongList () {
    return this.check(() => {
      return window.node.request(`/user/playlist?uid=${this.id}`)
      .then(res => {
        const subscribe:Object[] = []
        const create:Object[] = []

        res.body.playlist.forEach(val => {
          val.subscribed
            ? subscribe.push(val)
            : create.push(val)
        })
        return { subscribe, create }
      })
      .catch(err => {
        notice((err && err.body.msg) || '获取歌单失败')
        throw Error('error')
      })
    })
  }

  public getSongListDetail (id: number) {
    return this.check(() => {
      return window.node.request(`/playlist/detail?id=${id}`)
      .catch(err => {
        notice('获取歌单详情失败')
        console.log(err);
        throw new Error(err)
      })
    })
  }
}

export default new UserManager()