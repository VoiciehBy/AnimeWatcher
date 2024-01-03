const constants = require("./constants")
const GogoAnime = require("./GogoAnime")

const Gogoanime = new GogoAnime()

function lookForAnime(animeName) {
    return new Promise((resolve, reject) => {
        Gogoanime.search(animeName).then(results => {
            if (results.length !== 0)
                resolve(results[0])
            else
                reject(`Cannot find anime: ${animeName}`)
        })
    }).catch((err) => {
        console.error(err)
    })
}

function lookForAnimeName(animeName) {
    return new Promise((resolve, reject) => {
        lookForAnime(animeName).then(result => {
            resolve(result.title)
        })
    }).catch((err) => {
        console.error(err)
        reject(err)
    })
}

function lookForEpisode(animeName, episodeNumber) {
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
            resolve(constants.nullEpisode)
        })
    })
}

function lookForEpisodeURL(animeName, episodeNumber, timeout = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            lookForEpisode(animeName, episodeNumber).then(episode => {
                if (episode == constants.nullEpisode)
                    resolve(constants.angry_miku_url)
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

function lookForEpisodeCount(animeName = "naruto", timeout = 100) {
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
    getAnimeName: (animeName = "naruto") => lookForAnimeName(animeName),
    getAnimeURL: (animeName = "naruto", episodeNumber = 1) => lookForEpisodeURL(animeName, episodeNumber),
    getAnimeEpisodeCount: (animeName = "naruto") => lookForEpisodeCount(animeName)
}