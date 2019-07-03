const path = require('path')
const yarn = require('yargs')
const shortcut = require('./shortcut-register')
const { app, Menu, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let isDev = yarn && yarn.argv.dev

function createWindow () {
  if (process.platform === 'win32') {
    Menu.setApplicationMenu(null)
  }
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 670,
    // width: 1300,
    // height: 850,
    resizable: false,
    fullscreen: false,
    // frame: false,
    hasShadow: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      // nodeIntegration: false,
      contextIsolation: false,
      experimentalFeatures: true,
      preload: path.join(__dirname, './preload.js'),
    }
  })

  // 注册快捷键
  shortcut(isDev, mainWindow)

  // and load the index.html of the app.
  const url = isDev
    ? 'http://localhost:' + 2333
    : 'file://' + path.join(__dirname, '../dist/index.html')

  mainWindow.loadURL(url)

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({mode: 'bottom'})
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// 当Electron完成时，将调用此方法
// 初始化并准备创建浏览器窗口。
// 某些API只能在此事件发生后使用。
app.on('ready', createWindow)

// 关闭所有窗户后退出。
app.on('window-all-closed', function () {
  // 在OS X上，应用程序及其菜单栏很常见
  // 保持活动状态，直到用户使用Cmd + Q显式退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // 在OS X上，通常在应用程序中重新创建一个窗口
  // 单击停靠栏图标，没有其他窗口打开。
  if (mainWindow === null) {
    createWindow()
  }
})