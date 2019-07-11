const path = require('path')
const { windows } = require('../platform/utils')
const { app, Menu, Tray} = require('electron')

const trayMenuTemplate = win => [
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