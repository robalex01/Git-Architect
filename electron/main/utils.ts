import { contextBridge as electronContextBridge, ipcRenderer } from 'electron';

export const contextBridge = {
  // Preload-side wrapper: expose a safe IPC bridge to the renderer's real
  // window object using Electron's contextBridge (required when
  // contextIsolation: true — manually mutating globalThis.window here does
  // NOT reach the renderer, it must go through contextBridge.exposeInMainWorld).
  exposeIpc(namespace: string) {
    const invoke = (channel: string, ...args: any[]) => ipcRenderer.invoke(`${namespace}:${channel}`, ...args);
    electronContextBridge.exposeInMainWorld('__electron', { invoke });
  },
};
