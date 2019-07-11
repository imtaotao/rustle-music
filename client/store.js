const { ipcMain } = require('electron')

const store = {
  RuntimeManager: null,
}

ipcMain.on('setRuntimeManager', (e, rm) => {
  console.log(rm);
})

module.exports = store