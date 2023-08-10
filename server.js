const http = require("http");
const https = require("https");
const config = require("./config")
const nodeStatic = require("node-static")
const colors = require("colors")

const isThereIsAnime = (res) => http.STATUS_CODES[res.statusCode] !== "Not Found"


module.exports = {
    httpSServer: https.createServer(),
    fileServer: new nodeStatic.Server(config.frontendDirectory),
    lookForAnime: (baseUrl = "https://gogoanimehd.to/category/", animeName = "naruto") => {
        https.get(baseUrl + animeName, res => {
            if (isThereIsAnime(res))
                console.log(`${baseUrl} AVAILABLE...`.green)
            else
                console.log(`${baseUrl} PROBABLY DOWN...`.red)
        }).on("error", err => {
            console.log("Error: ", err.message.red);
        })
    }
}