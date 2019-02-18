import { createSlide } from 'input-range'

export default function (Grass: any) {
  // input-range
  Grass.directive('progress', (dom, options) => {
    options.component.created = function () {
      this.Slide = createSlide({
        point: dom,
        ...options,
      })
      setTimeout(() => this.Slide.init())
    }
  })
}