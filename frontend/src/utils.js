const fetch = require("cross-fetch");

const angry_miku_url = "https://s3.amazonaws.com/colorslive/png/552486-rsfMmEPLCm18L2-_.png";

const info_api = "https://api.jikan.moe/v4/";
const video_api = "http://2anime.xyz/embed/";

const nullEpisode = {
    id: -1,
    name: "null",
    url: "empty"
}

async function lookForAnime(query, timeout = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(`${info_api}anime?q=${query
                .toLowerCase()
                .replaceAll(" ", "-")}}&min_score=1.0`).then(res => {
                    res.json().then(res => {
                        if (res.data[0] != undefined)
                            resolve(res.data[0]);
                        else
                            reject(`Cannot find anime: ${query}`);
                    }).catch((err) => console.error(err))
                }).catch((err) => console.error(err))
        }, timeout)
    }).catch((err) => console.error(err))
}

async function lookForAnimeName(query) {
    return new Promise((resolve, reject) => {
        lookForAnime(query).then(anime => {
            const _anime = { title: anime.title };
            if (anime != undefined && _anime != undefined)
                resolve(_anime.title);
            resolve(nullEpisode.name);
        }).catch((err) => console.error(err))
    }).catch((err) => console.error(err))
}

function lookForEpisodes(id, timeout = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(`${info_api}anime/${id}/episodes`).then(res => {
                res.json().then(res => {
                    if (res.data != undefined && res.data.length != 0)
                        resolve(res.data);
                    reject(`Cannot find episodes of: ${id}`)
                }).catch((err) => console.error(err))
            }).catch((err) => console.error(err))
        }, timeout)
    }).catch((err) => console.error(err))
}

async function lookForEpisode(query, epNum, timeout = 1000) {
    return new Promise((resolve, reject) => {
        lookForAnime(query).then(anime => {
            if (anime != undefined) {
                const _anime = {
                    id: anime.mal_id,
                    title: anime.title,
                    type: anime.type
                }
                const episode = {
                    id: _anime.id,
                    name: _anime.title,
                    url: `${video_api}${_anime.title.toLowerCase()
                        .replaceAll(" ", "-")}-episode-${epNum}`
                }
                if (_anime.type === "Movie")
                    resolve(episode);
                else
                    setTimeout(() => {
                        lookForEpisodes(_anime.id).then(eps => {
                            if (eps != undefined && _anime != undefined) {
                                if (eps[epNum - 1] != undefined)
                                    episode.name = `${_anime.title} - ${eps[epNum - 1].title}`;//could change
                                resolve(episode);
                            }
                            resolve(nullEpisode);
                        }).catch((err) => console.error(err))
                    }, timeout)
            }
            else
                resolve(nullEpisode);
        }).catch((err) => console.error(err))
    })
}

async function lookForEpisodeURL(query, epNum) {
    return new Promise((resolve, reject) => {
        lookForEpisode(query, epNum).then(episode => {
            if (episode == nullEpisode) {
                console.error(`Cannot find episodes of anime: ${query}`);
                resolve(angry_miku_url);
            }
            resolve(episode.url);
        }).catch((err) => console.error(err))
    })
}

async function lookForEpisodeCount(query = "naruto") {
    return new Promise((resolve, reject) => {
        lookForAnime(query).then(anime => {//could change
            console.log(anime)
            if (anime === undefined)
                resolve(0)
            else if (anime.airing === false)
                resolve(anime.episodes)//epCount
            else if (anime.type === "Movie")
                resolve(1);
            else {
                lookForEpisodes(anime.mal_id).then(eps => {
                    if (eps != undefined)
                        resolve(eps.length);
                    resolve(0);
                }).catch((err) => console.error(err))
            }
        }).catch((err) => console.error(err))
    })
}

module.exports = {
    getAnimeName: (query = "naruto") => lookForAnimeName(query),
    getAnimeURL: async (query = "naruto", epNum = 1) => await lookForEpisodeURL(query, epNum),
    getEpisodeCount: async (query = "naruto") => await lookForEpisodeCount(query),
}