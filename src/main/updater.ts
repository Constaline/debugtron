import os from 'os'
import fetch from 'node-fetch'
import { dialog, shell } from 'electron'

const pkg = require('../../package.json')

export async function setUpdater() {
  switch (os.platform()) {
    // TODO: Make code sign work then use update-electron-app
    case 'darwin':
      try {
        const res = await fetch(
          `https://update.electronjs.org/${pkg.repository}/darwin-x64/${
            pkg.version
          }`,
        )
        if (!res.ok) return
        const json = await res.json()
        if (json.name.slice(1) !== pkg.version) {
          const res = await dialog.showMessageBox({
            message: `New release: ${json.name}\n\n${json.notes}`,
            buttons: ['Cancel', 'Download'],
          })
          if (res) {
            shell.openExternal(json.url)
          }
        }
      } catch (err) {
        console.error(err)
      }
      break
    case 'win32':
      require('update-electron-app')()
      break
    default:
    // TODO: Linux
  }
}
