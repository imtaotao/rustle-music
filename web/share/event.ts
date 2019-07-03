type Listener = {
  [key: string]: {
    once: Function[]
    normal: Function[]
  }
}
export default class Event {
  private listener:Listener = Object.create(null)

  public on (event: string, fn: Function) {
    const fnQueue = getEventFnQueue(this.listener, event)
    fnQueue.normal.push(fn)
    return true
  }

  public once (event: string, fn: Function) {
    const fnQueue = getEventFnQueue(this, event)
    fnQueue.once.push(fn)
    return true
  }

  public off (event: string, fn?: Function) {
    if (this.listener[event]) {
      if (typeof fn === 'function') {
        const remove = name => {
          const array = this.listener[event][name]
          const index = array.indexOf(fn)
          ~index && array.splice(index, 1)
        }
        remove('once')
        remove('normal')
        return true
      }

      if (fn === undefined) {
        this.listener[event].once = []
        this.listener[event].normal = []
        return true
      }
    }
    return false
  }

  public offAll () {
    this.listener = Object.create(null)
  }

  public dispatch (event: string, data?: any) {
    if (this.listener[event]) {
      this.listener[event].once.forEach(fn => fn(data))
      this.listener[event].once = []
      this.listener[event].normal.forEach(fn => fn(data))
      return true
    }
    return false
  }
}

function getEventFnQueue (listener:Object, event:string) {
  if (!listener[event]) {
    listener[event] = {
      normal: [],
      once: [],
    }
  }
  return listener[event]
}