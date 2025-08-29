const { contextBridge } = require('electron')
const fs = require('fs')
const path = require('path')
const { electronAPI } = require('@electron-toolkit/preload')

// Custom APIs for renderer
const api = {
  loadData: () => {
    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'compass.json'))
    )
    console.log('Loaded Labyrinth Data:', data) // Log the data in the preload script
    return data
  }
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
