import { ipcMain, ipcRenderer } from "electron";

// Constants for IPC channel names
export const OPEN_WINDOW_CHANNEL = "window:open";
export const CLOSE_WINDOWS_CHANNEL = "window:close";

export const windowMgrApi = {
  openWindow: (entryName: string, showAfterReady: boolean = true) =>
    ipcRenderer.invoke(OPEN_WINDOW_CHANNEL, entryName, showAfterReady),

  closeWindowsByEntryName: (entryName: string) =>
    ipcRenderer.invoke(CLOSE_WINDOWS_CHANNEL, entryName),
};
