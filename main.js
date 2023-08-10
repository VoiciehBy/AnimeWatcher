const server = require("./server")
const config = require("./config")
const serveError = require("./utils")

const colors = require("colors")

const { app, BrowserWindow } = require("electron")

const electron_reload = require("electron-reload")("./public")

const { ElectronBlocker } = require("@cliqz/adblocker-electron");

const fetch = require("cross-fetch")

const devMode = true
const adBlockerEnabled = true

const createWindow = () => {


    const window = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: "#20211f",
        icon: __dirname + "/assets/img/Jackiore_Miku.png",
        webPreferences: {
            webviewTag: true
        }
    })

    if (adBlockerEnabled) {
        const blocker = ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);

        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(window.webContents.session);
        })
    }

    if (devMode == false)
        window.setMenu(null)

    window.loadFile("public/index.html")
}

const initHttpServer = () => {
    server.httpSServer.on("request", (req, res) => {
        console.log(req.method, req.url);
        if (/^\rest/.test(req.url))
            serveError();
        else
            fileServer.serve(req, res);
    })

    server.httpSServer.listen(config.port, config.hostname, () => {
        console.log(`Server running at https://${config.hostname}:${config.port}/`.yellow)
    })
}


app.whenReady().then(() => {
    initHttpServer()

    let animeName = "naruto"
    server.lookForAnime("https://gogoanimehd.to/category/", animeName)
    server.lookForAnime("https://kissanime.org.ru/Anime/", animeName)
    createWindow()

    app.on("active", () => {
        let windows = BrowserWindow.getAllWindows();
        let windowsCount = windows.length;
        if (windowsCount == 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
})