const fetch = require("cross-fetch");
const c = require("./constants.json");
const { nullEpisode } = require("../../constants");

const _str_fun = (x) => x.toLowerCase().replaceAll(" ", "-");
const embed_url = (x, y) => `${c.video_api}${_str_fun(x)}-episode-${y}`;
const ep_name = (x, y = "") => `${x} - ${y}`;

async function lookForAnime(q, timeout = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(`${c.info_api}anime?q=${_str_fun(q)}}`).then(res => {
                res.json().then(res => {
                    if (res.data[0] != undefined)
                        resolve(res.data[0]);
                    else
                        reject(`Cannot find anime: ${q}`);
                }).catch((err) => console.error(err))
            }).catch((err) => console.error(err))
        }, timeout)
    }).catch((err) => console.error(err))
}

async function lookForAnimeName(q) {
    return new Promise((resolve, reject) => {
        lookForAnime(q).then(anime => {
            if (anime != undefined && anime.title != undefined)
                resolve(anime.title);
            resolve(c.nullEpisode.name);
        }).catch((err) => console.error(err))
    }).catch((err) => console.error(err))
}

function lookForEpisodes(id, timeout = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(`${c.info_api}anime/${id}/episodes`).then(res => {
                res.json().then(res => {
                    if (res.data != undefined && res.data.length != 0)
                        resolve(res.data);
                    reject(`Cannot find episodes of: ${id}`)
                }).catch((err) => console.error(err))
            }).catch((err) => console.error(err))
        }, timeout)
    }).catch((err) => console.error(err))
}

async function lookForEpisode(q, epNum, timeout = 1000) {
    return new Promise((resolve, reject) => {
        lookForAnime(q).then(anime => {
            if (anime != undefined) {
                const _anime = {
                    id: anime.mal_id,
                    title: anime.title,
                    type: anime.type,
                    status: anime.status
                }
                const episode = {
                    name: ep_name(_anime.title),
                    url: embed_url(_anime.title, epNum)
                }
                if (_anime.status != "Not yet aired") {
                    if (_anime.type === "Movie")
                        resolve(episode);//was here
                    else {
                        setTimeout(() => {
                            lookForEpisodes(_anime.id).then(eps => {
                                if (eps != undefined) {
                                    if (eps[epNum - 1] != undefined)
                                        episode.name = ep_name(_anime.title, eps[epNum - 1].title)
                                    resolve(episode);
                                }
                                resolve(c.nullEpisode);
                            }).catch((err) => console.error(err))
                        }, timeout)
                    }
                }
                else
                    resolve(c.nullEpisode);
            }
            else
                resolve(c.nullEpisode);
        }).catch((err) => console.error(err))
    })
}

async function lookForEpURL(q, epNum) {
    return new Promise((resolve, reject) => {
        lookForEpisode(q, epNum).then(episode => {
            if (episode == c.nullEpisode) {
                console.error(`Cannot find episodes of anime: ${q}`);
                resolve(c.angry_miku_url);
            }
            resolve(episode.url);
        }).catch((err) => console.error(err))
    })
}

async function lookForEpCount(q = "naruto") {
    return new Promise((resolve, reject) => {
        lookForAnime(q).then(anime => {
            if (anime != undefined) {
                if (anime.airing === false) {
                    if (!anime.episodes)
                        resolve(0);
                    else {
                        const episodeCount = anime.episodes;
                        resolve(episodeCount);
                    }
                }
                else {
                    lookForEpisodes(anime.mal_id).then(eps => {
                        if (eps != undefined)
                            resolve(eps.length);
                        resolve(0);
                    }).catch((err) => console.error(err))
                }
            }
            else
                resolve(0);
        }).catch((err) => console.error(err))
    })
}

module.exports = {
    getAnimeName: (q = "naruto") => lookForAnimeName(q),
    getAnimeURL: async (q = "naruto", epNum = 1) => await lookForEpURL(q, epNum),
    getEpisodeCount: async (q = "naruto") => await lookForEpCount(q),
}