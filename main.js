const config = require("./config")
const server = require("./server")

const fetch = require("cross-fetch")
const { ElectronBlocker } = require("@cliqz/adblocker-electron");

const { app, BrowserWindow } = require("electron")

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: config.iconPath,
        webPreferences: {
            nodeIntegration: true
        }
    })
    if (config.devMode === false)
        window.setMenu(null)
    else
        window.webContents.openDevTools()

    if (config.adBlockerEnabled) {
        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(window.webContents.session);
        })
    }

    window.loadFile(config.frontendDirectory + "index.html")
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