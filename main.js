const config = require("./config");
const db = require("./db");
const colors = require("colors");
const fetch = require("cross-fetch");
const { ElectronBlocker } = require("@cliqz/adblocker-electron");
const { app, BrowserWindow } = require("electron");

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
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
        window.webContents.setWindowOpenHandler((details) => { action: "deny" })
    }

    window.loadURL(`${__dirname}/frontend/dist/index.html`)
}

const clearCache = () => {
    let windows = BrowserWindow.getAllWindows();

    for (window in windows) {
        let session = window.webContents.session

        session.clearCache(() => {
            console.log("Cache cleared...".cyan)
        })
        session.clearStorageData(() => {
            console.log("HTTP cache cleared...".cyan)
        })
    }
}

app.whenReady().then(() => {
    console.log("Ready...".cyan)

    if (config.clearCacheEnabled)
        clearCache()
    createWindow()

    app.on("active", () => {
        let windows = BrowserWindow.getAllWindows();
        let windowsCount = windows.length;
        if (windowsCount == 0) {
            createWindow()
        }
    })

    db.clear()
    db.createTables();
    db.addAnime("Akira");
    db.addAnimeEp(1, 1, "Akira");
})

app.on("browser-window-focus", () => {
    console.log("Got Focused...".cyan);
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
})