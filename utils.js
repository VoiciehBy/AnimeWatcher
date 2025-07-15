const fetch = require("cross-fetch");

const angry_miku_url = "https://s3.amazonaws.com/colorslive/png/552486-rsfMmEPLCm18L2-_.png";

const nullEpisode = {
    id: -1,
    name: "null",
    url: "empty"
}

const info_api = "https://api.jikan.moe/v4/";
const video_api = "http://2anime.xyz/embed/";

function lookForAnime(searchQuery) {
    return new Promise((resolve, reject) => {
        const url = `${info_api}anime?q=${searchQuery.toLowerCase()
            .replaceAll(" ", "-")}}&min_score=1.0`;//could change
        fetch(url).then(results => {
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
        lookForAnime(searchQuery).then(result => {
            if (result.data[0] != undefined)
                resolve(result.data[0].title)//could change
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

function lookForEpisodes(id) {
    return new Promise((resolve, reject) => {
        const url = `${info_api}anime/${id}/episodes`;
        fetch(url).then(results => {
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

function lookForEpisode(searchQuery, episodeNumber) {
    return new Promise((resolve, reject) => {
        lookForAnime(searchQuery).then(animes => {
            if (animes.data[0] != undefined) {
                const url = `${video_api}${animes.data[0].title.toLowerCase()
                    .replaceAll(" ", "-")}`;
                const anime = {
                    id: animes.data[0].mal_id,
                    title: animes.data[0].title,
                    type: animes.data[0].type
                }//could change
                if (anime.type != "Movie")
                    lookForEpisodes(anime.id).then(episodes => {
                        const episode = {
                            id: anime.id,
                            name: anime.title,
                            url: `${url}-episode-${episodeNumber}`
                        }
                        if (episodes.data[0] != undefined) {
                            const episode_name = `${anime.title} - ${episodes.data[episodeNumber - 1].title}`;//could change
                            episode.name = episode_name;
                            resolve(episode)
                        }
                        else
                            resolve(nullEpisode)
                    })
                else {
                    const episode = {
                        id: anime.id,
                        name: anime.title,
                        url: `${url}-episode-${episodeNumber}`
                    }
                    resolve(episode)
                }

            }
            else
                resolve(nullEpisode)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}

function lookForEpisodeURL(searchQuery, episodeNumber, timeout = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            lookForEpisode(searchQuery, episodeNumber).then(episode => {
                console.log(episode)
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

function lookForEpisodeCount(searchQuery = "naruto", timeout = 500) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            lookForAnime(searchQuery).then(animes => {
                if (animes.data[0] === undefined)
                    resolve(0)
                else if (animes.data[0].airing === false)
                    resolve(animes.data[0].episodes)//could change
                else {
                    if (animes.data[0].type != "Movie")//could change
                        lookForEpisodes(animes.data[0].mal_id).then(episodes => {//could change
                            resolve(episodes.data.length)//could change
                        })
                    else
                        resolve(1);
                }
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