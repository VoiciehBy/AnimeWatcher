const { ElectronBlocker } = require("@cliqz/adblocker-electron");
const fetch = require("cross-fetch")

const utils = module.exports = {
    serveError: (res, code) => {
        res.writeHead(code, { "Content-Type": "text/plain;charset=utf-8" });
        res.write("Error, xDddd....")
        res.end()
    },
    enableAdBlocker: (window) => {
        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(window.webContents.session);
        })
    }
}