import { ipcRenderer } from 'electron';

export const contextBridge = {
  // Preload-side wrapper.
  // Renderer will call: window.__electron?.invoke('<channel>', ...args)
  exposeIpc(namespace: string) {
    const invoke = (channel: string, ...args: any[]) => ipcRenderer.invoke(`${namespace}:${channel}`, ...args);

    const w = (globalThis as any).window ?? {};
    w.__electron = { invoke };
    (globalThis as any).window = w;
  },
};






