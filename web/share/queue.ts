export default class Queue {
  fx: Function[] = []
  init = true
  lock = false
  
  public register (fn: Function) {
    this.fx.push(fn)
 
    if (this.init) {
      this.lock = false
      this.init = false
      this.dispatch()
    }
   }
 
   public dispatch (data?: any) {
    if (!this.lock) {
      if (this.fx.length === 0) {
      this.end(data)
      this.init = true
      }
  
      const fn = this.fx.shift()
  
      if (typeof fn === 'function') {
        const next = data => {
          this.lock = false
          // call next fn
          this.dispatch(data)
        }
        // call fn, we need lock
        this.lock = true
        fn.call(null, next, data)
      }
    }
  }

  public end (data?:any) {}

  public remove (start: number, end = 1) {
    this.fx.splice(start, end)
  }

  public clean () {
    this.fx = []
    this.init = true
    this.lock = false
  }
}