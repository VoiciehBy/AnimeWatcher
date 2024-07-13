const ctkAnimeScraper = require("ctk-anime-scraper");

const angry_miku_url = "https://s3.amazonaws.com/colorslive/png/552486-rsfMmEPLCm18L2-_.png";

const nullEpisode = {
    name: "Not found",
    episodeCount: '0',
    id: "notFound"
}

const scraper = new ctkAnimeScraper.Gogoanime(
    { base_url: "https://anitaku.to/" }
);

function lookForAnime(searchQuery) {
    return new Promise((resolve, reject) => {
        scraper.search(searchQuery).then(results => {
            if (results.length !== 0)
                resolve(results[0]);
            else
                reject(`Cannot find anime: ${searchQuery}`)
        }).catch((err) => console.error(err))
    }).catch((err) => console.error(err));
}

function lookForAnimeName(searchQuery) {
    return new Promise((resolve, reject) => {
        lookForAnime(searchQuery).then(result => {
            resolve(result.title)
        }).catch((err) => console.error(err));
    }).catch((err) => {
        console.error(err)
        reject(err)
    })
}

function lookForEpisode(searchQuery, episodeNumber) {
    return new Promise((resolve, reject) => {
        lookForAnime(searchQuery).then(result => {
            scraper.fetchAnime(result.link).then(anime => {
                scraper.getEpisodes(anime.slug, episodeNumber).then(episode => {
                    if (anime.slug === undefined)
                        reject(`Anime (${searchQuery}) slug does not exist...`)
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

function lookForEpisodeURL(searchQuery, episodeNumber, timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            lookForEpisode(searchQuery, episodeNumber).then(episode => {
                console.log(episode == nullEpisode);
                if (episode == nullEpisode)
                    resolve(angry_miku_url);
                else {
                    let root = "goone.pro" // "embtaku.pro"
                    let url = "https://" + root + "/streaming.php?id="
                    url += episode.id;
                    resolve(url);
                }
            }).catch((err) => console.error(err));
        }, timeout)
    })
}

function lookForEpisodeCount(searchQuery = "naruto", timeout = 100) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            lookForAnime(searchQuery).then(result => {
                scraper.fetchAnime(result.link).then(anime => {
                    resolve(anime.episodeCount)
                }).catch((err) => console.error(err))
            }).catch((err) => {
                console.error(err)
                resolve(0)
            })
        }, timeout)
    })
}

module.exports = {
    getAnimeName: (searchQuery = "naruto") => lookForAnimeName(searchQuery),
    getAnimeURL: (searchQuery = "naruto", episodeNumber = 1) => lookForEpisodeURL(searchQuery, episodeNumber),
    getEpisodeCount: (searchQuery = "naruto") => lookForEpisodeCount(searchQuery)
}