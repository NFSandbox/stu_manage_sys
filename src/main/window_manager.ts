import { app, BrowserWindow, Menu } from "electron";
import { ipcMain, ipcRenderer } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const LOGIN_WINDOW_WEBPACK_ENTRY: string;
declare const LOGIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const SUB_WINDOW_WEBPACK_ENTRY: string;
declare const SUB_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const STU_WINDOW_WEBPACK_ENTRY: string;
declare const STU_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const SEL_WINDOW_WEBPACK_ENTRY: string;
declare const SEL_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Constants for IPC channel names
export const OPEN_WINDOW_CHANNEL = "window:open";
export const CLOSE_WINDOWS_CHANNEL = "window:close";

interface EntryInfoItem {
  renderer: string;
  preload: string;
  initHeight: number;
  initWidth: number;
}

const entryPathInfo: Record<string, EntryInfoItem> = {
  main: {
    renderer: MAIN_WINDOW_WEBPACK_ENTRY,
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    initHeight: 1080,
    initWidth: 1920,
  },
  login: {
    renderer: LOGIN_WINDOW_WEBPACK_ENTRY,
    preload: LOGIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    initHeight: 400,
    initWidth: 600,
  },
  sub: {
    renderer: SUB_WINDOW_WEBPACK_ENTRY,
    preload: SUB_WINDOW_PRELOAD_WEBPACK_ENTRY,
    initHeight: 1080,
    initWidth: 1920,
  },
  stu: {
    renderer: STU_WINDOW_WEBPACK_ENTRY,
    preload: STU_WINDOW_PRELOAD_WEBPACK_ENTRY,
    initHeight: 1080,
    initWidth: 1920,
  },
  sel: {
    renderer: SEL_WINDOW_WEBPACK_ENTRY,
    preload: SEL_WINDOW_PRELOAD_WEBPACK_ENTRY,
    initHeight: 1080,
    initWidth: 1920,
  },
};

export function openWindow(
  entryName: string,
  showAfterReady = true,
): BrowserWindow {
  let entryInfo = undefined;
  try {
    entryInfo = entryPathInfo[entryName];
  } catch (e) {
    throw Error(`Window with entry name ${entryName} does not exists`);
  }

  const newWindow = new BrowserWindow({
    tabbingIdentifier: entryName,
    width: entryInfo.initWidth,
    height: entryInfo.initHeight,
    webPreferences: {
      preload: entryInfo.preload,
    },
    show: showAfterReady ? false : true,
  });

  newWindow.loadURL(entryInfo.renderer);

  if (entryName === "main") {
    newWindow.setMenu(
      Menu.buildFromTemplate([
        {
          label: "学生管理",
          click: () => {
            openWindow("stu");
          },
        },
        {
          label: "课程管理",
          click: () => {
            openWindow("sub");
          },
        },
        {
          label: "选课管理",
          click: () => {
            openWindow("sel");
          },
        },
      ]),
    );
  }

  if (showAfterReady) {
    newWindow.once("ready-to-show", () => {
      newWindow.show();
    });
  }

  // help to quit the app if this is the last window and has been closed
  newWindow.on("closed", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      app.quit();
    }
  });

  return newWindow;
}

/**
 * Close all windows with the specified entry name.
 */
export function closeWindowsByEntryName(entryName: string) {
  const windows = BrowserWindow.getAllWindows();
  for (const curWindow of windows) {
    if (curWindow.tabbingIdentifier === entryName) {
      window.close();
    }
  }
}

/**
 * Register IPC handlers for opening and closing windows in the main process.
 */
export function registerOpenWindowHandler() {
  // Handler for opening a new window
  ipcMain.handle(
    OPEN_WINDOW_CHANNEL,
    async (event, entryName: string, showAfterReady = true) => {
      try {
        const newWindow = openWindow(entryName, showAfterReady);
        return { success: true, id: newWindow.id };
      } catch (error) {
        console.error(`Failed to open window: ${error.message}`);
        return { success: false, error: error.message };
      }
    },
  );

  // Handler for closing all windows with a specific entry name
  ipcMain.handle(CLOSE_WINDOWS_CHANNEL, async (event, entryName: string) => {
    try {
      closeWindowsByEntryName(entryName);
      return { success: true };
    } catch (error) {
      console.error(`Failed to close windows: ${error.message}`);
      return { success: false, error: error.message };
    }
  });
}
