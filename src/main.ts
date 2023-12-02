import path from "path";
import { cpSync, existsSync } from "fs";
import { app, BrowserWindow, ipcMain, protocol } from "electron";

import { TileDefinitions } from "./utils/tile-definitions";

const TILES_FOLDER_NAME = "tiles";
const BASE_PATH =
  process.env.NODE_ENV === "development"
    ? app.getAppPath()
    : process.resourcesPath;

const setupDefaultTiles = () => {
  const defaultTilesPath = path.join(BASE_PATH, `./${TILES_FOLDER_NAME}`);

  const userTilesPath = path.join(app.getPath("userData"), TILES_FOLDER_NAME);

  if (!existsSync(userTilesPath)) {
    cpSync(defaultTilesPath, userTilesPath, { recursive: true });
  }
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  protocol.registerFileProtocol("tiles", (request, callback) => {
    const url = request.url.substr(8);

    callback({ path: path.join(app.getPath("userData"), "tiles", url) });
  });

  const tileDefinitions = new TileDefinitions();
  tileDefinitions.loadTileDefinitions(
    path.join(app.getPath("userData"), "tiles")
  );

  ipcMain.handle("get-definitions", () => ({
    buildingDefinitions: tileDefinitions.buildingDefinitions,
    furnitureDefinitions: tileDefinitions.furnitureDefinitions,
  }));

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  setupDefaultTiles();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
