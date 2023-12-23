const AnimeScraper = require("ctk-anime-scraper")

class GogoanimeFixed extends AnimeScraper.Gogoanime {
    constructor({ base_url } = {}) {
        super(base_url);
        this.base_url = "https://anitaku.to/";
    }
}

const Gogoanime = new GogoanimeFixed()

const nullEpisode = {
    name: "Not found",
    episodeCount: '0',
    id: "notFound"
}

const angry_miku_url = "https://s3.amazonaws.com/colorslive/png/552486-rsfMmEPLCm18L2-_.png"

function lookForAnime(animeName) {
    return new Promise((resolve, reject) => {
        Gogoanime.search(animeName).then(results => {
            if (results.length !== 0)
                resolve(results[0])
            else
                reject(`Cannot find anime: ${animeName}`)
        })
    })
}

function lookForAnimeEpisode(animeName, episodeNumber) {
    return new Promise((resolve, reject) => {
        lookForAnime(animeName).then(result => {
            Gogoanime.fetchAnime(result.link).then(anime => {
                Gogoanime.getEpisodes(anime.slug, episodeNumber).then(episode => {
                    if (anime.slug === undefined)
                        reject(`Anime (${animeName}) slug does not exist...`)
                    else
                        resolve(episode)
                })
            })
        }).catch((err) => {
            console.error(err)
            resolve(nullEpisode)
        })
    })
}

function lookForAnimeEpisodeURL(animeName, episodeNumber, timeout = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            lookForAnimeEpisode(animeName, episodeNumber).then(episode => {
                if (episode == nullEpisode)
                    resolve(angry_miku_url)
                else {
                    let root = "goone.pro"
                    let url = "https://" + root + "/streaming.php?id="
                    url += episode.id
                    resolve(url)
                }
            }).catch((err) => {
                console.error(err)
            })
        }, timeout)
    })
}

function lookForAnimeEpisodeCount(animeName = "naruto", timeout = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            lookForAnime(animeName).then(result => {
                Gogoanime.fetchAnime(result.link).then(anime => {
                    resolve(anime.episodeCount)
                }).catch((err) => {
                    console.error(err)
                })
            }).catch((err) => {
                console.error(err)
                resolve(0)
            })
        }, timeout)
    })
}

module.exports = {
    getAnimeURL: (animeName = "naruto", episodeNumber = 1) => lookForAnimeEpisodeURL(animeName, episodeNumber),
    getAnimeEpisodeCount: (animeName = "naruto") => lookForAnimeEpisodeCount(animeName)
}
