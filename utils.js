const fetch = require("cross-fetch");

const angry_miku_url = "https://s3.amazonaws.com/colorslive/png/552486-rsfMmEPLCm18L2-_.png";

const nullEpisode = {
    name: "null",
    episodeCount: 0,
    url: "empty"
}

const info_api = "https://api.jikan.moe/v4/";
const video_api = "http://2anime.xyz/embed/";

function lookForAnime(searchQuery) {
    return new Promise((resolve, reject) => {
        fetch(`${info_api}anime?q=${searchQuery}`).then(results => {
            resolve(results.json());
        }).catch((err) => {
            console.error(err)
            reject(err)
        });
    }).catch((err) => {
        console.error(err)
        reject(err)
    });
}

function lookForAnimeName(searchQuery) {
    return new Promise((resolve, reject) => {
        lookForAnime(searchQuery).then(result => {//could change
            if (result.pagination.items.count != 0){
                const name = result.data[0].title_english;
                resolve(name)
            }
            else
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

function lookForEpisode(searchQuery, episodeNumber) {
    return new Promise((resolve, reject) => {
        lookForAnime(searchQuery).then(result => {//could change
            if (result.pagination.items.count != 0) {
                const anime_title = result.data[0].title;
                const url = `${video_api}${anime_title.toLowerCase()
                    .replaceAll(" ", "-")}-episode-${episodeNumber}`;
                const episode = {
                    name: `${anime_title}#episodeNumber`,
                    url: `${url}`
                }
                resolve(episode)
            }
            else
                resolve(nullEpisode)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}

function lookForEpisodeURL(searchQuery, episodeNumber, timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            lookForEpisode(searchQuery, episodeNumber).then(episode => {
                if (episode == nullEpisode) {
                    console.error(`Cannot find anime: ${searchQuery}`)
                    resolve(angry_miku_url);
                }
                else
                    resolve(episode.url);
            }).catch((err) => {
                console.error(err)
                reject(err)
            });
        }, timeout)
    })
}

function lookForEpisodeCount(searchQuery = "naruto", timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            lookForAnime(searchQuery).then(result => {
                const episodeCount = result.data[0].episodes;
                resolve(episodeCount)
            }).catch((err) => {
                console.error(err)
                reject(err)
            })
        }, timeout)
    })
}

module.exports = {
    getAnimeName: (searchQuery = "naruto") => lookForAnimeName(searchQuery),
    getAnimeURL: (searchQuery = "naruto", episodeNumber = 1) => lookForEpisodeURL(searchQuery, episodeNumber),
    getEpisodeCount: (searchQuery = "naruto") => lookForEpisodeCount(searchQuery),
}