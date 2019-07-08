import { notice } from 'web/utils'
import Event from 'web/share/event'

class SongManager extends Event {
  lock = false
  cached = false
  ids = new Set()

  cache (fn: (fn: Function) => void) {
    if (!this.cached) {
      fn((ids: any[]) => {
        ids.map(val => this.ids.add(val.id))
        this.dispatch('update', null)
        this.cached = true
      })
    }
  }

  addCacheId (id: number) {
    if (this.cached) {
      this.ids.add(id)
      this.dispatch('update', true)
    }
  }

  replace (list: Array<Object>) {
    this.ids.clear()
    this.cached = false
    this.cache(send => send(list))
  }

  removeCacheId (id: number) {
    this.ids.delete(id)
    this.dispatch('update', false)
  }

  cleanCache () {
    this.ids.clear()
    this.cached = false
    this.dispatch('update', null)
  }

  has (id: number) {
    return this.ids.has(id)
  }

  // 发送请求
  requestLike (id: number) {
    if (this.lock) {
      notice('稍安勿躁，等待这次操作完成~')
      return Promise.reject(false)
    }

    this.lock = true
    const isLike = !this.has(id)
    isLike ? this.addCacheId(id) : this.removeCacheId(id)

    return window.node.request(`/like?like=${isLike}&id=${id}`)
      .then(res => {
        this.lock = false
        isLike
          ? notice('已添加到我喜欢的音乐', true)
          : notice('取消喜欢成功', true)
      }, err => {
        this.lock = false
        isLike ? this.removeCacheId(id) : this.addCacheId(id)
        notice(err.body.msg || isLike ? '添加到喜欢失败' : '取消喜欢失败')
        console.error(err)
        return err
      })
  }
}

export default new SongManager()