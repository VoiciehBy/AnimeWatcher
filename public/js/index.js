function openAnimePage(elementId, baseUrl = "https://gogoanimehd.to/category/") {
    var animeName = document.getElementById(elementId).value
    animeName = animeName.replace(/\s/g, '-')
    const embedPlayer = document.getElementById("embedPlayer")
    embedPlayer.src = baseUrl + animeName
}

function checkAnimePages(elementId) {
    openAnimePage(elementId)
    //openAnimePage(elementId, "https://kissanime.org.ru/Anime/")
}

function setup() {
    const form = document.getElementById("searchAnimeForm")
    form.action = "javascript:checkAnimePages('SearchAnimeField')"
    form.method = "post"
} setup()