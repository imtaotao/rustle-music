import * as I from './type'
import Event from 'web/share/event'
import { notice } from 'web/utils'
import { Media } from '@rustle/hearken'

const defaultCurrent = {
  id: 0,
  name: '-',
  dt: '0',
  ar: { name: '' },
  al: { name: '' },
}

class RuntimeManager extends Event {
  playlist: I.Song[] = []
  current: I.Song = defaultCurrent
  addlist = new Set()
  started = false

  Hearken = new Media()

  public push (item: I.Song) {
    this.playlist.push(item)
    this.dispatch('playlistChanged')
    return true
  }

  public pushList (listname: string | number, list: I.Song[]) {
    if (this.addlist.has(listname)) return false
    if (Array.isArray(list)) {
      this.playlist = this.playlist.concat(list)
      this.addlist.add(listname)
      if (this.current === defaultCurrent) {
        this.current = list[0]
      }
      this.dispatch('playlistChanged')
      return true
    }
    return false
  }


  public clear () {
    this.playlist = []
    this.addlist.clear()
    this.dispatch('playlistChanged')
    return true
  }

  public replaceAll (list: I.Song[]) {
    this.playlist = list
    this.addlist.clear()
    this.current = list[0]
    // 切换的时候从第一个开始播放
    this.specifiedPlay(0)
    this.dispatch('playlistChanged')
    return true
  }

  public specifiedPlay (item: I.Song | number) {
    if (typeof item === 'number') {
      item = this.playlist[item]
    } else {
      // 如果不在播放列表中，就添加到播放列表中
      const find = this.playlist.find(val => {
        return val.id === (<I.Song>item).id
      })
      if (!find) this.push(item)
      
    }
    this.toStartNewSong(item).catch(msg => notice(msg))
  }

  public next () {
    let index = this.findCurrentIndex()
    if (typeof index === 'number') {
      index++
      if (index >= this.playlist.length) {
        index = 0
      }
      const item = this.playlist[index]
      if (!item) return false
      this.toStartNewSong(item).catch(msg => {
        notice(msg)
        this.next()
      })
      return true
    }
    return false
  }

  public previous () {
    let index = this.findCurrentIndex()
    if (typeof index === 'number') {
      index--
      if (index < 0) {
        index = this.playlist.length - 1
      }
      const item = this.playlist[index]
      if (!item) return false
      this.toStartNewSong(item).catch(msg => {
        notice(msg)
        this.previous()
      })
      return true
    }
    return false
  }

  // 播放音乐
  private toStartNewSong (item: I.Song) {
    this.Hearken.stop()
    this.current = item
    return new Promise((_, reject) => {
      window.node.request('/check/music?id=' + item.id).then(({body}) => {
        if (item.id !== this.current.id) return
        const {success, message} = body
        if (!success) reject(message)

        this.getSongDetailInfo(item.id).then(url => {
          if (item.id !== this.current.id) return
          this.Hearken.ready(h => h.start(url))
          this.dispatch('currentChanged')
          this.dispatch('start')
        })
      }, err => notice(err.body.msg))
    })
  }

  // 获取音乐 url
  private getSongDetailInfo (id: number) {
    return new Promise(resolve => {
      window.node.request('/song/url?id=' + id).then(({body}) => {
        resolve(body.data[0].url)
      }, err => notice(err.body.msg))
    })
  }

  private findCurrentIndex () {
    if (this.current === defaultCurrent) return 0
    const index = this.playlist.indexOf(<I.Song>this.current)
    return index > -1
      ? index
      : null
  }
}

const Runtime = new RuntimeManager()
Runtime.Hearken.on('start', () => Runtime.started = true)
Runtime.Hearken.on('stop', () => Runtime.started = false)
export default Runtime;

(window as any).h = Runtime