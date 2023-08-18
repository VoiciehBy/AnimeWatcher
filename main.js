const server = require("./server")
const config = require("./config")
const utils = require("./utils")

const AnimeScraper = require("ctk-anime-scraper")
const Gogoanime = new AnimeScraper.Gogoanime()

const { ElectronBlocker } = require("@cliqz/adblocker-electron");
const fetch = require("cross-fetch")

const url = require("url")
const fs = require("fs")

const { app, BrowserWindow, ipcMain } = require("electron")

const electron_reload = require("electron-reload")("./public")

const path = require("path")
const colors = require("colors");

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname + "/assets/img/Jackiore_Miku.png"),
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
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

    window.loadFile("public/index.html")
}

let person = {
    name: "A",
    year: 1970
}

app.whenReady().then(() => {
    console.log("Ready...".cyan)

    ipcMain.handle("onSetIFramePlayerSrc", async (event, animeName) => {
        console.log("56: " + animeName)
        return utils.getAnimeURL(animeName)
    })

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