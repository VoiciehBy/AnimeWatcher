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
        setTimeout(() => fetch(`${info_api}anime?q=${query
            .toLowerCase()
            .replaceAll(" ", "-")}}&min_score=1.0`).then(res => {
                resolve(res.json());
            }).catch((err) => {
                console.error(err)
                reject(err)
            }), timeout)
    }).catch((err) => {
        console.error(err)
        reject(err)
    });
}

async function lookForAnimeName(query) {
    return new Promise((resolve, reject) => {
        lookForAnime(query).then(res => {
            const animes = res.data;
            const anime = { title: animes[0].title };
            if (anime != undefined)
                resolve(anime.title)
            resolve(nullEpisode.name)
        }).catch((err) => {
            console.error(err)
            reject(err)
        });
    }).catch((err) => {
        console.error(err)
        reject(err)
    });
}

async function lookForEpisode(query, epNum) {
    return new Promise((resolve, reject) => {
        lookForAnime(query).then(res => {
            const animes = res.data;
            const anime = {
                id: animes[0].mal_id,
                title: animes[0].title,
                type: animes[0].type
            }
            if (anime.id != undefined) {
                const episode = {
                    id: anime.id,
                    name: anime.title,
                    url: `${video_api}${anime.title
                        .toLowerCase()
                        .replaceAll(" ", "-")}-episode-${epNum}`
                }
                if (anime.type != "Movie")
                    fetch(`${info_api}anime/${anime.id}/episodes`).then(res => {
                        res.json().then(res => {
                            const episodes = res.data;
                            if (episodes[0] != undefined) {
                                episode.name = `${anime.title} - ${episodes[epNum - 1].title}`;//could change
                                resolve(episode);
                            }
                            resolve(nullEpisode);
                        })
                    })
                else
                    resolve(episode);
            }
            else
                resolve(nullEpisode);
        }).catch((err) => {
            console.error(err);
            reject(err);
        })
    })
}

async function lookForEpisodeURL(query, epNum) {
    return new Promise((resolve, reject) => {
        lookForEpisode(query, epNum).then(episode => {
            if (episode == nullEpisode) {
                console.error(`Cannot find anime: ${query}`);
                resolve(angry_miku_url);
            }
            resolve(episode.url);
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}

async function lookForEpisodeCount(query = "naruto") {
    return new Promise((resolve, reject) => {
        lookForAnime(query).then(res => {
            const animes = res.data;
            const anime = {
                id: animes[0].mal_id,
                airing: animes[0].airing,
                type: animes[0].type,
                episodeCount: animes[0].episodes
            }
            if (anime === undefined)
                resolve(0)
            else if (anime.airing === false)
                resolve(anime.episodeCount)
            else if (anime.type === "Movie")
                resolve(1);
            else {
                lookForEpisodes(anime.id).then(res => {
                    resolve(res.data.length)
                }).catch((err) => {
                    console.error(err)
                    reject(err)
                })
            }
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}

module.exports = {
    getAnimeName: (query = "naruto") => lookForAnimeName(query),
    getAnimeURL: async (query = "naruto", epNum = 1) => await lookForEpisodeURL(query, epNum),
    getEpisodeCount: async (query = "naruto") => await lookForEpisodeCount(query),
}