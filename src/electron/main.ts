import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false, // Disable resizing
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (isDev()) mainWindow.loadURL("http://localhost:6600");
  else
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
});
