import * as I from './type'
import Event from 'web/share/event'
import { random, notice } from 'web/utils'
import { Media } from '@rustle/hearken'

const defaultCurrent:I.Song = {
  id: 0,
  name: '-',
  dt: '0',
  ar: [{name: '' }],
  al: { name: '' },
}

class RuntimeManager extends Event {
  playlist: I.Song[] = []
  current: I.Song = defaultCurrent
  addlist = new Set()
  mode: I.PlayMode = 'cycle'
  FM: boolean = false
  DisableSwitch: boolean = false

  Hearken = new Media({volume: 0.5})

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

  public replaceAll (listname: string | number, list: I.Song[], index?: number) {
    this.playlist = list
    this.addlist.clear()
    if (typeof index === 'number') {
      // 切换的时候默认从第一个开始播放
      this.specifiedPlay(index, () => {
        // 如果出现错误就播放下一个
        list.length > 1 && this.next()
      })
    }
    this.addlist.add(listname)
    this.dispatch('playlistChanged')
    return true
  }

  // 指定播放
  public specifiedPlay (item: I.Song | number, err?: Function) {
    if (this.DisableSwitch) return
    let needDispath = false
    if (typeof item === 'number') {
      item = this.playlist[item]
    } else {
      // 如果不在播放列表中，就添加到播放列表中
      const find = this.playlist.find(val => val.id === (<I.Song>item).id)
      if (!find) {
        this.playlist.unshift(item)
        needDispath = true
      }
    }

    if (item && item !== defaultCurrent) {
      const fn = (newItem) => {
        this.toStartNewSong(<I.Song>newItem)
        .then(() => {
          if (needDispath) {
            this.dispatch('playlistChanged')
          }
        })
        .catch(msg => {
          notice(msg)
          err && err()
        })
      }

      const al:any = item.album || item.al
      // 如果没有歌曲背景图片，需要从专辑里面获取
      if (!al.picUrl) {
        window.node.request('/album?id=' + al.id).then(({body}) => {
          const newItem = body.songs && body.songs[0]
          newItem && newItem.id === (<any>item).id
            ? fn(newItem)
            : fn(item)
        }, err => fn(item))
      } else {
        fn(item)
      }
    }
  }

  public next () {
    this.dispatch('nextBefore')
    if (this.DisableSwitch) return true

    let index = this.findCurrentIndex()
    if (typeof index === 'number') {
      index++
      if (index >= this.playlist.length) {
        index = 0
      }
      const item = this.playlist[index]
      if (!item) return false
      this.toStartNewSong(item)
      .then(() => {
        this.dispatch('next')
      })
      .catch(msg => {
        notice(msg)
        this.next()
      })
      return true
    }
    return false
  }

  public previous () {
    this.dispatch('previousBefore')
    if (this.DisableSwitch) return true

    let index = this.findCurrentIndex()
    if (typeof index === 'number') {
      index--
      if (index < 0) {
        index = this.playlist.length - 1
      }
      const item = this.playlist[index]
      if (!item) return false
      this.toStartNewSong(item)
      .then(() => {
        this.dispatch('previous')
      })
      .catch(msg => {
        notice(msg)
        this.previous()
      })
      return true
    }
    return false
  }

  public randomPlay () {
    this.dispatch('randomBefore')
    if (this.DisableSwitch) return true

    const index = Number(random(this.playlist.length - 1, 0))
    if (typeof index === 'number' && !isNaN(index)) {
      const item = this.playlist[index]
      if (!item) return false
      this.toStartNewSong(item)
      .then(() => {
        this.dispatch('random')
      })
      .catch(msg => {
        notice(msg)
        this.previous()
      })
      return true
    }
    return false
  }

  // 设置模式
  public setMode (mode: I.PlayMode) {
    this.mode = mode
    this.dispatch('modeChanged')
  }

  public setFM (fm: boolean) {
    this.FM = true
    this.dispatch('setfm')
  }

  public setDisableSwitch (isDisable: boolean) {
    this.DisableSwitch = isDisable
    this.dispatch('setDisable')
  }

  // 播放音乐
  private toStartNewSong (item: I.Song) {
    this.Hearken.stop()
    return new Promise((resolve, reject) => {
      // 如果发现和当前音乐是同一首
      if (item.id === this.current.id && this.Hearken.audio.src) {
        this.Hearken.restart()
        return
      }

      this.current = item

      window.node.request('/check/music?id=' + item.id).then(({body}) => {
        if (item.id !== this.current.id) return
        const {success, message} = body
        if (!success) reject(message)
        this.getSongDetailInfo(item.id).then(url => {
          if (item.id !== this.current.id) return
          this.Hearken.ready(h => h.start(url))
          this.dispatch('currentChanged')
          this.dispatch('start')
          resolve()
        })
      }, err => reject(err.body.message))
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
    let index: null | number = null
    // find 函数明细快于 for
    this.playlist.find((val:I.Song, i:number) => {
      const res = val.id === this.current.id
      if (res) index = i
      return res
    })
    return index
  }
}

const Runtime = new RuntimeManager()
export default Runtime;

(window as any).run = Runtime;
(window as any).hh = Runtime.Hearken