const { app, globalShortcut } = require('electron')
const { macOs, windows } = require('../platform/utils')

module.exports = function (isDev, mainWindow) {
  if (windows()) {
    globalShortcut.register('Alt+Q', () => {
      app.quit()
    })
  }
  
  globalShortcut.register('Ctrl+Alt+I', () => {
    mainWindow.webContents.openDevTools({mode: 'bottom'})
  })

  // 测试环境下，保持两端快捷键同步
  if (isDev) {
    // if (windows()) {
    //   globalShortcut.register('Ctrl+Alt+I', () => {
    //     mainWindow.webContents.openDevTools({mode: 'bottom'})
    //   })
    // }
    globalShortcut.register('Alt+R', () => {
      mainWindow.webContents.reload()
    })
  }
}