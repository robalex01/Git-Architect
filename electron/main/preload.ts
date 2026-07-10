import { contextBridge } from './utils';

// Expose IPC wrappers used by the renderer.
// Renderer will call: window.__electron?.invoke('path')
contextBridge.exposeIpc('gitarch');




