const http = require("http");
const db = require("./db");

const server = http.createServer();
const port = 3000;
const hostname = "127.0.0.1"

function respond(res, msg, code, ending, err) {
    if (err != undefined)
        console.error(msg);
    else
        console.log(msg);
    res.writeHead(code, http.STATUS_CODES[code]);
    res.end(ending);
}

server.on("request", (req, res) => {
    const request_url = new URL(req.url, `http:${req.headers.host}`);
    const pathname = request_url.pathname;
    const params = new URLSearchParams(request_url.search);
    res.setHeader("Content-Type", "application/json");

    switch (req.method) {
        case "GET":
            if (pathname === "/")
                respond(res, "Ok", 200, `{"info": "Ok"}`);
            else if (pathname === "/anime") {
                if (params.has("name")) {
                    let name = params.get("name");
                    db.getAnime(name).then((result) => {
                        if (JSON.stringify(result) === JSON.stringify({}))
                            respond(res, `${name} was not found...`, 404, JSON.stringify(result), " ");
                        else
                            respond(res, `${name} found...`, 200, JSON.stringify(result), " ");
                    }).catch((err) => respond(res, `Getting ${name} failed...`, 500, `{"error":"${err}"}`, err))
                }
            }
            else if (pathname === "/episode") {
                if (params.has("anime_name") && params.has("no")) {
                    let anime_name = params.get("anime_name");
                    let no = params.get("no");
                    db.getAnimeEp(anime_name, no).then((result) => {
                        if (JSON.stringify(result) === JSON.stringify({}))
                            respond(res, `E#${no} of ${anime_name} was not found`, 404, JSON.stringify(result), " ");
                        else
                            respond(res, `E#${no} of ${anime_name} was found...`, 200, JSON.stringify(result), " ");
                    }).catch((err) => respond(res, `Getting E#${no} of ${anime_name} failed...`, 500, `{"error":"${err}"}`, err))
                }
            }
            else if (pathname === "/episodes") {
                if (params.has("anime_name")) {
                    let anime_name = params.get("anime_name");
                    db.getAnimeEpisodes(anime_name).then((result) => {
                        if (JSON.stringify(result) === JSON.stringify({}))
                            respond(res, `Episodes of ${anime_name} was not found`, 404, JSON.stringify(result), " ");
                        else
                            respond(res, `Episodes of ${anime_name} was found...`, 200, JSON.stringify(result));
                    }).catch((err) => respond(res, `Getting episodes of ${anime_name} failed...`, 500, `{"error":"${err}"}`, err))
                }
            }
            else
                respond(res, "Bad params...", 422, `{"error": "Bad params..."}`, "Bad params");
            break;
        case "PUT":
            if (pathname === "/new_anime") {
                if (params.has("name")) {
                    let name = params.get("name");
                    db.getAnime(name).then((result) => {
                        if (JSON.stringify(result) === JSON.stringify({}))
                            db.addAnime(name).then(() => respond(res, `${name} was added...`, 201, `{"res":"${name} was added..."}`)
                            ).catch((err) => respond(res, `Adding ${name} failed...`, 500, `{"error":"${err}"}`, err));
                        else
                            respond(res, `${name} already exists...`, 403, `{"res":"${name} already exists..."}`, " ");
                    })
                }
            }
            else if (pathname === "/new_episode") {
                if (params.has("anime_name") && params.has("no")) {
                    let anime_name = params.get("anime_name");
                    let no = params.get("no");
                    db.getAnime(anime_name).then((result) => {
                        if (JSON.stringify(result) === JSON.stringify({}))
                            respond(res, `${anime_name} was not found...`, 404, JSON.stringify(result), " ");
                        else {
                            let anime_id = result.id;
                            db.getAnimeEp(anime_name, no).then((result) => {
                                if (JSON.stringify(result) === JSON.stringify({}))
                                    db.addAnimeEp(anime_id, no).then(() => {
                                        respond(res, `E#${no} of ${anime_name} was added...`, 201, `{"res":"E#${no} of ${anime_name} was added..."}`);
                                    }).catch((err) => respond(res, `Adding E#${no} of ${anime_name} failed...`, 500, `{"error":"${err}"}`, err));
                                else
                                    respond(res, `E#${no} of ${anime_name} already exists...`, 403, `{"res":"E#${no} of ${anime_name} already exists..."}`, " ");
                            })
                        }
                    }).catch((err) => respond(res, `Getting ${anime_name} failed...`, 500, `{"error":"${err}"}`, err));
                }
            }
            else
                respond(res, "Bad params...", 422, `{"error": "${err}"}`, "Bad params");
            break;
        case "PATCH":
            if (pathname === "/episode") {
                if (params.has("anime_name") && params.has("no")) {
                    let anime_name = params.get("anime_name");
                    let no = params.get("no");
                    db.getAnime(anime_name).then((result) => {
                        if (JSON.stringify(result) === JSON.stringify({}))
                            respond(res, `${anime_name} was not found...`, 404, JSON.stringify(result), " ");
                        else {
                            let anime_id = result.id;
                            db.getAnimeEp(anime_name, no).then((result) => {
                                if (JSON.stringify(result) != JSON.stringify({}))
                                    db.markEpisodeAsWatched(anime_id, no).then(() =>
                                        respond(res, `E#${no} of ${anime_name} was marked as watched...`, 201, `{"res":"E#${no} of ${anime_name} was marked as watched..."}`)
                                    ).catch((err) => respond(res, `Marking E#${no} of ${anime_name} as watched failed...`, 500, `{"error":"${err}"}`, err));
                                else
                                    respond(res, `E#${no} of ${anime_name} was not found...`, 404, `{"res":"E#${no} of ${anime_name} was not found..."}`, " ");
                            })
                        }
                    }).catch((err) => respond(res, `Getting ${anime_name} failed...`, 500, `{"error":"${err}"}`, err));
                }
            }
            else
                respond(res, "Bad params...", 422, `{"error": "${err}"}`, "Bad params");
            break;
        default:
            respond(res, "Not implemented...", 501, `{"error":"Not implemented"}`, " ")
            break;
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})