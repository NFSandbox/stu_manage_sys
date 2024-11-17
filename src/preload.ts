// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";

import { stuDataApi } from "@/main/info_manager";
import { dialogApi } from "@/main/popper";
const windowApi = {
  open: {
    main: () => {
      ipcRenderer.send("window:open:main");
    },
  },
};

const api = {
  window: windowApi,
  dialog: dialogApi,
  stuData: stuDataApi,
};

export type ElectronApiType = typeof api;

contextBridge.exposeInMainWorld("electron", api);
