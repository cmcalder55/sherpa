const { contextBridge } = require('electron')
const fs = require('fs')
const path = require('path')
const { electronAPI } = require('@electron-toolkit/preload')

// Custom APIs for renderer
const api = {
  loadData: () => {
    try {
      const filePath = path.join(__dirname, '..', '..', 'data', 'compass.json')

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error('Data file not found:', filePath)
        return { data: [], lastModified: null }
      }

      // Read and parse file
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(fileContent)
      const stats = fs.statSync(filePath)

      console.log('Loaded Labyrinth Data:', data)
      return {
        data: Array.isArray(data) ? data : [],
        lastModified: stats.mtime.getTime()
      }
    } catch (error) {
      console.error('Error loading data:', error)
      return { data: [], lastModified: null }
    }
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
