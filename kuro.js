
const config = require("./config");
const http = require("http");
const node_static = require("node-static");

const kuro = http.createServer();
const fileServer = new node_static.Server("./videos")

function respond(res, msg, code, ending, err) {
    if (err != undefined)
        console.error(msg);
    else
        console.log(msg);
    res.writeHead(code, http.STATUS_CODES[code]);
    res.end(ending);
}

kuro.on("request", (req, res) => {
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    //crashing very often
    
    switch (req.method) {
        case "GET":
            fileServer.serve(req, res, () => { console.log("XD"); });
            break;
        default:
            respond(res, "Not implemented", 501, `{"error":"Not implemented"}`, " ");
            break;
    }
})

kuro.listen(config.file_server_port, config.file_server_hostname, () => {
    console.log(`File Server running at http://${config.file_server_hostname}:${config.file_server_port}/`);
})