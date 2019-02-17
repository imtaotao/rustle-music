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
    const fn = this.routers[url]
    if (typeof fn === 'function') {
      if (url !== this.current.val || fn._forceDirect) {
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
        fn(data)
      }
    } else {
      console.error(`Router warn: "${url}" page is not register.`)
    }
  },

  register (url: string, fn: Function, forceDirect = false) {
    if (typeof fn === 'function') {
      (<any>fn)._forceDirect = forceDirect
      this.routers[url] = fn
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