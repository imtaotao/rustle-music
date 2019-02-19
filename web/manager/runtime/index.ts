import * as I from './type'
import Event from 'web/share/event'
import { Media } from '@rustle/hearken'


class RuntimeManager extends Event {
  playList: I.Song[] = []
  current: I.Song | null = null
  Hearken = new Media()

  public push (item: I.Song) {
    this.playList.push(item)
    this.dispatch('push')
    return true
  }

  public pushList (list: I.Song[]) {
    if (Array.isArray(list)) {
      this.playList = this.playList.concat(list)
      this.dispatch('push')
      return true
    }
    return false
  }

  public next () {
    let index = this.findCurrentIndex()
    if (typeof index === 'number') {
      index++
      if (index >= this.playList.length) {
        index = 0
      }
      const item = this.playList[index]
      if (!item) return false
      this.toStartNewSong(item)
      return true
    }
    return false
  }

  public previous () {
    let index = this.findCurrentIndex()
    if (typeof index === 'number') {
      index--
      if (index < 0) {
        index = this.playList.length - 1
      }
      const item = this.playList[index]
      if (!item) return false
      this.toStartNewSong(item)
      return true
    }
    return false
  }

  private toStartNewSong (item: I.Song) {
    this.Hearken.stop()
    this.Hearken.start(item.url)
  }

  private findCurrentIndex () {
    if (!this.current) return null
    const index = this.playList.indexOf(this.current)
    return index > -1
      ? index
      : null
  }
}

const r = new RuntimeManager();
(window as any).r = r
export default r