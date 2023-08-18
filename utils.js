const AnimeScraper = require("ctk-anime-scraper")
const Gogoanime = new AnimeScraper.Gogoanime()

const defaultAnimeName = "Nisekoi"

function lookForAnime(animeName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Gogoanime.search(animeName).then(results => {
                Gogoanime.fetchAnime(results[0].link).then(anime => {
                    Gogoanime.getEpisodes(anime.slug, 1).then(episode => {
                        let url = "https://gotaku1.com/streaming.php?id="
                        url += episode.id
                        resolve(url)
                    })
                })
            })
        }, 1000)
    })
}

const utils = module.exports = {
    serveError: (res, code) => {
        res.writeHead(code, { "Content-Type": "text/plain;charset=utf-8" });
        res.write("Error, xDddd....")
        res.end()
    },
    getAnimeURL: (animeName = defaultAnimeName) => lookForAnime(animeName)
}