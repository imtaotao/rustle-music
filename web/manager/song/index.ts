import { notice } from 'web/utils'

class SongManager {
  cached = false
  ids = new Set()
  cache (fn: (fn: Function) => number[]) {
    if (!this.cached) {
      fn((ids: any[]) => {
        ids.map(val => this.ids.add(val.id))
        this.cached = true
      })
    }
  }

  addCacheId (id: number) {
    if (this.cached) {
      this.ids.add(id)
    }
  }

  removeCacheId (id: number) {
    this.ids.delete(id)
  }

  cleanCache () {
    this.ids.clear()
    this.cached = false
  }

  has (id: number) {
    if (!this.cached) {
      notice('需要登录')
      return false
    }
    return this.ids.has(id)
  }
}

const s = new SongManager()
export default s;
(window as any).s = s