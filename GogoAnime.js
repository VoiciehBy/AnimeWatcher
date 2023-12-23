const AnimeScraper = require("ctk-anime-scraper")

class GogoAnime extends AnimeScraper.Gogoanime {
    constructor({ base_url } = {}) {
        super(base_url);
        this.base_url = "https://anitaku.to/";
    }
}

module.exports = GogoAnime