const http = require("http");
const https = require("https");
const config = require("./config")
const nodeStatic = require("node-static")
const colors = require("colors")

const isThereIsAnime = (res) => http.STATUS_CODES[res.statusCode] !== "Not Found"

const checkProvider = (baseUrl = "http://gogoanimehd.to/category/") => {
    http.get(baseUrl + "naruto", res => {
        if (isThereIsAnime(res))
            console.log(`${baseUrl} AVAILABLE...`.green)
        else
            console.log(`${baseUrl} PROBABLY DOWN...`.red)
    }).on("error", err => {
        console.log("Error: ", err.message.red);
    })
}

const httpSServer = http.createServer()
const fileServer = new nodeStatic.Server(config.frontendDirectory)

module.exports = {
    checkProviders: () => {
        checkProvider()
        checkProvider("http://kissanime.org.ru/Anime/")
    },
    initHttpSServer : () => {
        httpSServer.on("request", (req, res) => {
            console.log(req.method, req.url);
            let parsed = url.parse(req.url, true)
    
            switch (parsed.pathname) {
                case "/get":
                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" })
                    res.write(JSON.stringify(person))
                    res.end()
                    break
                case "/set":
                    person.name = parsed.query.name
                    person.year = parseInt(parsed.query.year)
                    if (isNaN(person.year)) person.year = 1970
                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" })
                    res.write(JSON.stringify(person))
                    res.end()
                    break
                default:
                    server.fileServer.serve(req, res);
            }
        })
    
        httpSServer.listen(config.port, config.hostname, () => {
            console.log(`Server running at http://${config.hostname}:${config.port}/`.green)
        })
    }
}