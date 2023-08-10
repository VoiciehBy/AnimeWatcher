function openAnimePage(elementId, baseUrl = "https://gogoanimehd.to/category/") {
    var animeName = document.getElementById(elementId).value
    animeName = animeName.replace(/\s/g, '-')
    const iframePlayer = document.getElementById("iframePlayer")
    iframePlayer.src = baseUrl + animeName
}

function checkAnimePages(elementId) {
    const providerNumber = document.getElementById("providerNumber").innerHTML;

    if (providerNumber == '0')
        openAnimePage(elementId)
    else if (providerNumber == '1')
        openAnimePage(elementId, "https://kissanime.org.ru/Anime/")
}

function setup() {
    const form = document.getElementById("searchAnimeForm")
    form.action = "javascript:checkAnimePages('SearchAnimeField')"
    form.method = "post"
} setup()