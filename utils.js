const AnimeScraper = require("ctk-anime-scraper")

class GogoanimeFixed extends AnimeScraper.Gogoanime{
    constructor({base_url}={}){
        super(base_url);
        this.base_url = "https://anitaku.to/";
    }
}

const Gogoanime = new GogoanimeFixed()

function lookForAnimeEpisodeURL(animeName, episodeNumber, timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Gogoanime.search(animeName).then(results => {
                Gogoanime.fetchAnime(results[0].link).then(anime => {
                    Gogoanime.getEpisodes(anime.slug, episodeNumber).then(episode => {
                        let root = "goone.pro"
                        let url = "https://" + root + "/streaming.php?id="
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

module.exports = {
    getAnimeURL: (animeName = "naruto", episodeNumber = 1) => lookForAnimeEpisodeURL(animeName, episodeNumber),
    getAnimeEpisodeCount: (animeName = "naruto") => lookForAnimeEpisodeCount(animeName)
}
