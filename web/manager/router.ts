export default {
  history: [],
  routers: {},
  capacity: 5, // 历史纪录最多 5 个
  current: {
    val: null,
    data: null,
    index: 0,
  },

  to (url: string, data: any, index?: number) {
    const routers = this.routers
    const show = routers[url] && routers[url].show
    if (typeof show === 'function') {
      // 如果将要展示的页面与当前页面不一样
      // 或者强制更新
      // 或者通过历史记录返回的
      if (url !== this.current.val || show._forceDirect || index != null) {
        const item = {
          data,
          val: url,
          index: index == null 
            ? this.history.length
            : index
        }
        this.current = item
        if (index == null) {
          if (this.history.length > this.capacity) {
            this.history.shift()
          }
          this.history.push(item)
        }
        // 隐藏其他的所有页面
        for (const key in routers) {
          if (key !== url) {
            const hide = routers[key].hide
            typeof hide === 'function' && hide(data)
          }
        }
        // 显示当前页面
        show(data)
      }
    } else {
      throw new Error(`Router warn: "${url}" page is not register.`)
    }
  },

  register (url: string, show: Function, hide?: Function, forceDirect = false) {
    if (typeof show === 'function') {
      (<any>show)._forceDirect = forceDirect
      this.routers[url] = { show, hide }
    }
  },

  back () {
    const index = this._findCurrentIndex()
    if (index !== null) {
      const item = this.history[index - 1]
      if (item) {
        this.to(item.val, item.data, item.index)
      }
    }
  },

  forward () {
    const index = this._findCurrentIndex()
    if (index !== null) {
      const item = this.history[index + 1]
      if (item) {
        this.to(item.val, item.data, item.index)
      }
    }
  },

  canBack () {
    const index = this._findCurrentIndex()
    if (index !== null) {
      return  !!this.history[index - 1]
    }
    return false
  },

  canForward () {
    const index = this._findCurrentIndex()
    if (index !== null) {
      return  !!this.history[index + 1]
    }
    return false
  },

  _findCurrentIndex () {
    let index: null | number = null
    for (let i = 0; i < this.history.length; i++) {
      const item = this.history[i]
      if (item.val === this.current.val && item.index === this.current.index) {
        index = i
        break
      }
    }
    return index
  }
}