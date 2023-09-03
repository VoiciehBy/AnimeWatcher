const config = require("./config")
//const utils = require("./utils")
const server = require("./server")

const fetch = require("cross-fetch")
const { ElectronBlocker } = require("@cliqz/adblocker-electron");

const { app, BrowserWindow} = require("electron")

const path = require("path")
const colors = require("colors");

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1024,
        height: 768,
        //icon: path.join(__dirname + config.iconPath),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    })
    if (config.devMode == false)
        window.setMenu(null)
    else
        window.webContents.openDevTools()

    if (config.adBlockerEnabled) {
        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(window.webContents.session);
        })
    }

    window.loadFile("frontend/dist/frontend/index.html")
}

app.whenReady().then(() => {
    console.log("Ready...".cyan)

    server.initHttpSServer()
    server.checkProviders()
    createWindow()

    app.on("active", () => {
        let windows = BrowserWindow.getAllWindows();
        let windowsCount = windows.length;
        if (windowsCount == 0) {
            createWindow()
        }
    })
})

app.on("browser-window-focus", () => {
    console.log("Got Focused...".cyan)
    server.checkProviders()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
})