const constants = require("./constants")
const GogoAnime = require("./GogoAnime")

const Gogoanime = new GogoAnime()

function lookForAnime(searchQuery) {
    return new Promise((resolve, reject) => {
        Gogoanime.search(searchQuery).then(results => {
            if (results.length !== 0)
                resolve(results[0])
            else
                reject(`Cannot find anime: ${searchQuery}`)
        }).catch((err) => {
            console.error(err)
        })
    }).catch((err) => {
        console.error(err)
    })
}

function lookForSearchQuery(searchQuery) {
    return new Promise((resolve, reject) => {
        lookForAnime(searchQuery).then(result => {
            resolve(result.title)
        }).catch((err) => {
            console.error(err)
        })
    }).catch((err) => {
        console.error(err)
        reject(err)
    })
}

function lookForEpisode(searchQuery, episodeNumber) {
    return new Promise((resolve, reject) => {
        lookForAnime(searchQuery).then(result => {
            Gogoanime.fetchAnime(result.link).then(anime => {
                Gogoanime.getEpisodes(anime.slug, episodeNumber).then(episode => {
                    if (anime.slug === undefined)
                        reject(`Anime (${searchQuery}) slug does not exist...`)
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

function lookForEpisodeURL(searchQuery, episodeNumber, timeout = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            lookForEpisode(searchQuery, episodeNumber).then(episode => {
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

function lookForEpisodeCount(searchQuery = "naruto", timeout = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            lookForAnime(searchQuery).then(result => {
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
    getSearchQuery: (searchQuery = "naruto") => lookForSearchQuery(searchQuery),
    getAnimeURL: (searchQuery = "naruto", episodeNumber = 1) => lookForEpisodeURL(searchQuery, episodeNumber),
    getEpisodeCount: (searchQuery = "naruto") => lookForEpisodeCount(searchQuery)
}