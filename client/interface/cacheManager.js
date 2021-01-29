module.exports = {
  time: 60, // 默认缓存时长 1分钟
  store: {},

  has(route) {
    const unit = this.store[route]
    if (unit && unit.data) {
      const diff = (Date.now() - unit.start) / 1000
      if (diff >= unit.time) {
        this.store[route] = null
        return false
      }
      return true
    }
    return false
  },

  get(route) {
    const unit = this.store[route]
    return unit ? unit.data : null
  },

  set(route, data, time) {
    this.store[route] = {
      data,
      start: Date.now(),
      time: time || this.time,
    }
  },

  clear() {
    this.store = {};
  }
}