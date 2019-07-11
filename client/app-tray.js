const path = require('path')
const { macOs, windows } = require('../platform/utils')
const { app, Menu, Tray} = require('electron')

const trayMenuTemplate = [
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
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)

    appTray.setToolTip('rustle')
    appTray.setContextMenu(contextMenu)

    appTray.on('click', () => {
      win.show()
    })
  }
}