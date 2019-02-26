const path = require('path')
const yarn = require('yargs')
const { app, Menu, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const isDev = yarn && yarn.argv.dev

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})