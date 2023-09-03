const utils = module.exports = {
    serveError: (res, code) => {
        res.writeHead(code, { "Content-Type": "text/plain;charset=utf-8" });
        res.write("Error, xDddd....")
        res.end()
    }
}
