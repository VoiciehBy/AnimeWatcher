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
            resolve(constants.nullEpisode)
        })
    })
}

function lookForAnimeEpisodeURL(animeName, episodeNumber, timeout = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            lookForAnimeEpisode(animeName, episodeNumber).then(episode => {
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