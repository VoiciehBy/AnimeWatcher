const config = require("./config")
const server = require("./server")

const fetch = require("cross-fetch")
const { ElectronBlocker } = require("@cliqz/adblocker-electron");

const { app, BrowserWindow } = require("electron")
//searchAnimeField < 24 characters anime name
const createWindow = () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        icon: `${__dirname}/frontend/dist/assets/img/Jackiore_Miku.png`,
        webPreferences: {
            devTools: config.devMode,
            nodeIntegration: true
        }
    })
    if (config.devMode == false)
        window.setMenu(null)

    if (config.adBlockerEnabled) {
        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(window.webContents.session);
        })
    }
    window.loadURL(`${__dirname}/frontend/dist/index.html`)
}

app.whenReady().then(() => {
    console.log("Ready...".cyan)

    if (config.devMode) {
        server.initHttpSServer()
        server.checkProviders()
    }
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
    if (config.devMode)
        server.checkProviders()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
})