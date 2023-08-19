const searchAnimeField = document.getElementById("searchAnimeField")
const animeEpisodeField = document.getElementById("animeEpisodeField")
const searchSubmitButton = document.getElementById("searchSubmitButton")
const ifFramePlayer = document.getElementById("iframePlayer")

searchSubmitButton.addEventListener("click", async () => {
    let animeName = searchAnimeField.value
    let episodeNumber = animeEpisodeField.value
    let animeLink = await window.electronAPI.setIFramePlayerSrc(animeName, episodeNumber)
    ifFramePlayer.src = animeLink
})