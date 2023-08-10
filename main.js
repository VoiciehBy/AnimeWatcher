const server = require("./server")
const config = require("./config")
const utils = require("./utils")

const { app, BrowserWindow } = require("electron")

const electron_reload = require("electron-reload")("./public")

const path = require("path")
const colors = require("colors")

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname + "/assets/img/Jackiore_Miku.png"),
        webPreferences: {
            webviewTag: true,
            preload: path.join(__dirname, "preload.js")
        }
    })
    if (config.devMode == false)
        window.setMenu(null)

    if (config.adBlockerEnabled)
        utils.enableAdBlocker(window)

    window.loadFile("public/index.html")
}

const initHttpSServer = () => {
    server.httpSServer.on("request", (req, res) => {
        console.log(req.method, req.url);
        if (/^\rest/.test(req.url))
            utils.serveError();
        else
            server.fileServer.serve(req, res);
    })

    server.httpSServer.listen(config.port, config.hostname, () => {
        console.log(`Server running at https://${config.hostname}:${config.port}/`.green)
    })
}


app.whenReady().then(() => {
    initHttpSServer()

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