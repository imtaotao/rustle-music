const path = require('path')
const { app, Menu, Tray, MenuItem } = require('electron')
const { windows } = require('../platform/utils')

const trayMenuTemplate = win => [
  {
    label: '退出',
    role: 'quit',
    enabled: true,
    visible: true,
    accelerator: 'Alt+Q',
  },
  {
    label: '下一首',
    click () {
      console.log(this.items)
    }
  },
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

    setTimeout(() => {
      contextMenu.items[0].label = '11111'
      console.log(contextMenu.items[0]);
    }, 2000)
  }
}