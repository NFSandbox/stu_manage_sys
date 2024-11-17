import {
  ipcMain,
  dialog,
  BrowserWindow,
  ipcRenderer,
} from "electron";

interface PopContent {
  title?: string;
  description: string;
  type: "success" | "warn" | "error";
}

const showDialogIpcMsg = "dialog:show";

export function registerDialogPopper() {
  ipcMain.handle(showDialogIpcMsg, async (event, content) => {
    const { title, description, type } = content;

    if (type === "error") {
      dialog.showErrorBox(title ?? "错误", description);
    } else {
      await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        type: type === "success" ? "info" : "warning",
        title: title ?? "成功",
        message: description,
      });
    }
  });
}

export const dialogApi = {
  showMessage: (content: PopContent) =>
    ipcRenderer.invoke(showDialogIpcMsg, content),
};
