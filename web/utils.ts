export function notice (msg: string, time = 1500) {
  const noticeCompnent = document.createElement('div')
  noticeCompnent.innerHTML = msg
  noticeCompnent.className = 'notice'

  document.body.appendChild(noticeCompnent)

  setTimeout(() => {
    noticeCompnent.style.webkitTransition = 'transform 0.5s ease-in, opacity 0.5s ease-in'
    noticeCompnent.style.opacity = '0'
    setTimeout(() => document.body.removeChild(noticeCompnent), 500)
  }, time)
}