const path = require('path')
const { app, Menu, Tray} = require('electron')
const { windows } = require('../platform/utils')

const trayMenuTemplate = win => [
  {
    label: '下一首',
    click () {
      console.log(win.webContents.store)
    }
  },
  {
    label: '退出',
    click () {
      app.quit()
    }
  }
]

module.exports = function (win) {
  if (windows()) {
    const appTray = new Tray(path.join(__dirname, './res/favicon.ico'))
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate(win))

    appTray.setToolTip('rustle music')
    appTray.setContextMenu(contextMenu)

    appTray.on('click', () => {
      win.show()
    })
  }
}