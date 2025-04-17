import { dialog } from 'electron'
import os from 'os'
import { config, description, version } from '../../../package.json'
import { mainWindow } from '../app'

export function aboutDialog() {
  if (!mainWindow) return

  const detail = [
    `${description} \n`,
    `Version: v${version} \n`,
    `Electron: ${process.versions.electron}`,
    `Chrome: ${process.versions.chrome}`,
    `Node: ${process.versions.node}`,
    `V8: ${process.versions.v8}`,
    `OS: ${os.type()} ${os.arch()} ${os.release()}`,
  ].join('\n')

  dialog.showMessageBoxSync(mainWindow, {
    title: config.productName,
    message: config.productName,
    type: 'info',
    detail,
  })
}
