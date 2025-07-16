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
    const nullJSON = JSON.stringify({});
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    switch (req.method) {
        case "GET":
            if (pathname === "/")
                respond(res, "Ok", 200, `{"info": "Ok"}`);
            else if (pathname === "/anime") {
                if (params.has("name")) {
                    let name = params.get("name");
                    db.getAnime(name).then((result) => {
                        if (JSON.stringify(result) === nullJSON)
                            respond(res, `${name} not found`, 404, r, " ");
                        else
                            respond(res, `${name} found`, 200, r, " ");
                    }).catch((err) =>
                        respond(res, `Getting ${name} failed`, 500, `{"error":"${err}"}`, err));
                }
            }
            else if (pathname === "/episode") {
                if (params.has("anime_name") && params.has("no")) {
                    let anime_name = params.get("anime_name");
                    let no = params.get("no");
                    db.getAnimeEp(anime_name, no).then((result) => {
                        let r = JSON.stringify(result);
                        if (r === nullJSON)
                            respond(res, `${anime_name}E#${no} not found`, 404, r, " ");
                        else
                            respond(res, `${anime_name}E#${no} found`, 200, r, " ");
                    }).catch((err) =>
                        respond(res, `Getting ${anime_name}E#${no} failed`, 500, `{"error":"${err}"}`, err));
                }
            }
            else if (pathname === "/episodes") {
                if (params.has("anime_name")) {
                    let anime_name = params.get("anime_name");
                    db.getAnimeEpisodes(anime_name).then((result) => {
                        if (JSON.stringify(result) === nullJSON)
                            respond(res, `Eps of ${anime_name} not found`, 404, JSON.stringify(result), " ");
                        else
                            respond(res, `Eps of ${anime_name} found`, 200, JSON.stringify(result));
                    }).catch((err) =>
                        respond(res, `Getting eps of ${anime_name} failed`, 500, `{"error":"${err}"}`, err));
                }
            }
            else
                respond(res, "Bad params", 422, `{"error": "Bad params"}`, "Bad params");
            break;
        case "PUT":
            if (pathname === "/new_anime") {
                if (params.has("name")) {
                    let name = params.get("name");
                    db.getAnime(name).then((result) => {
                        if (JSON.stringify(result) === nullJSON)
                            db.addAnime(name.replaceAll("'", "")).then(() =>
                                respond(res, `${name} was added`, 201, `{"res":"${name} was added"}`)
                            ).catch((err) =>
                                respond(res, `Adding ${name} failed`, 500, `{"error":"${err}"}`, err));
                        else
                            respond(res, `${name} already here`, 403, `{"res":"${name} already here"}`, " ");
                    })
                }
            }
            else if (pathname === "/new_episode") {
                if (params.has("anime_name") && params.has("no") && params.has("name")) {
                    let anime_name = params.get("anime_name");
                    let no = params.get("no");
                    let name = params.get("name");
                    db.getAnime(anime_name).then((result) => {
                        if (JSON.stringify(result) === nullJSON)
                            respond(res, `${anime_name} not found`, 404, JSON.stringify(result), " ");
                        else {
                            let anime_id = result.id;
                            db.getAnimeEp(anime_name, no).then((result) => {
                                if (JSON.stringify(result) === nullJSON)
                                    db.addAnimeEp(anime_id, no, name).then(() => {
                                        respond(res, `${anime_name}E#${no} added`, 201, `{"res":"${anime_name}E#${no} added"}`);
                                    }).catch((err) =>
                                        respond(res, `Adding ${anime_name}E#${no} failed`, 500, `{"error":"${err}"}`, err));
                                else
                                    respond(res, `${anime_name}E#${no} already here`, 403, `{"res":"${anime_name}E#${no} already here"}`, " ");
                            })
                        }
                    }).catch((err) =>
                        respond(res, `Getting ${anime_name} failed`, 500, `{"error":"${err}"}`, err));
                }
            }
            else
                respond(res, "Bad params", 422, `{"error": "${err}"}`, "Bad params");
            break;
        case "PATCH":
            if (pathname === "/episode") {
                if (params.has("anime_name") && params.has("no")) {
                    let anime_name = params.get("anime_name");
                    let no = params.get("no");
                    db.getAnime(anime_name).then((result) => {
                        if (JSON.stringify(result) === nullJSON)
                            respond(res, `${anime_name} not found`, 404, JSON.stringify(result), " ");
                        else {
                            let anime_id = result.id;
                            db.getAnimeEp(anime_name, no).then((result) => {
                                if (JSON.stringify(result) != nullJSON)
                                    if (params.has("watched"))
                                        db.markEpisodeAsNotWatched(anime_id, no).then(() =>
                                            respond(res, `Marked ${anime_name}E#${no} as not watched`, 201, `{"res":"Marked ${anime_name}E#${no} as not watched"}`)
                                        ).catch((err) => respond(res, `Marking ${anime_name}E#${no} as watched failed`, 500, `{"error":"${err}"}`, err));
                                    else
                                        db.markEpisodeAsWatched(anime_id, no).then(() =>
                                            respond(res, `Marked ${anime_name}E#${no} as watched`, 201, `{"res":"Marked ${anime_name}E#${no} as watched"}`)
                                        ).catch((err) => respond(res, `Marking ${anime_name}E#${no} as watched failed`, 500, `{"error":"${err}"}`, err));
                                else
                                    respond(res, `E#${no} of ${anime_name} not found`, 404, `{"res":"E#${no} of ${anime_name} not found"}`, " ");
                            })
                        }
                    }).catch((err) =>
                        respond(res, `Getting ${anime_name} failed`, 500, `{"error":"${err}"}`, err));
                }
            }
            else
                respond(res, "Bad params", 422, `{"error": "${err}"}`, "Bad params");
            break;
        case "DELETE":
            if (pathname === "/all") {
                db.clear().then(() =>
                    respond(res, "Db has been cleared succesfully", 204, nullJSON)
                ).catch((err) =>
                    respond(res, "Db clear failed", 500, `{"error": "${err}}`, err));
            }
            else
                respond(res, "Bad params", 422, `{"error": "${err}"}`, "Bad params");
            break;
        case "OPTIONS":
            respond(res, "Ok", 200, nullJSON)
            break;
        default:
            respond(res, "Not implemented", 501, `{"error":"Not implemented"}`, " ");
            break;
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})