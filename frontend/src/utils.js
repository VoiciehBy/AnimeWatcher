const AnimeScraper = require("ctk-anime-scraper")
const Gogoanime = new AnimeScraper.Gogoanime()

//const colors = require("colors")

function lookForAnimeEpisodeURL(animeName, episodeNumber, timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Gogoanime.search(animeName).then(results => {
                Gogoanime.fetchAnime(results[0].link).then(anime => {
                    Gogoanime.getEpisodes(anime.slug, episodeNumber).then(episode => {
                        let url = "https://goone.pro/streaming.php?id="
                        url += episode.id
                        resolve(url)
                    })
                })
            })
        }, timeout)
    }).catch((err) => {
        console.error(err)
        console.error("Anime not found...")
    })
}

function lookForAnimeEpisodeCount(animeName = "naruto", timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Gogoanime.search(animeName).then(results => {
                Gogoanime.fetchAnime(results[0].link).then(anime => {
                    resolve(anime.episodeCount)
                })
            })
        }, timeout)
    }).catch((err) => {
        console.error(err)
        console.error("Cannot fetch anime episode count")
    })
}

const utils = module.exports = {
    getAnimeURL: (animeName = "naruto", episodeNumber = 1) => lookForAnimeEpisodeURL(animeName, episodeNumber),
    getAnimeEpisodeCount: (animeName = "naruto") => lookForAnimeEpisodeCount(animeName)
}
