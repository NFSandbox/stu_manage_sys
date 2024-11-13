import { app, BrowserWindow } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const LOGIN_WINDOW_WEBPACK_ENTRY: string;
declare const LOGIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

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
