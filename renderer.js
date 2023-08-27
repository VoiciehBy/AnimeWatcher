const searchAnimeField = document.getElementById("searchAnimeField")
const animeEpisodeField = document.getElementById("animeEpisodeField")
const searchSubmitButton = document.getElementById("searchSubmitButton")
const animeEpisodeCountField = document.getElementById("episodeCount")
const episodeCountPicker = document.getElementById("episodeCountPicker")
const ifFramePlayer = document.getElementById("iframePlayer")

searchSubmitButton.addEventListener("click", async () => {
    let animeName = searchAnimeField.value
    let currentEpisode = animeEpisodeField.value
    let animeLink = await window.electronAPI.setIFramePlayerSrc(animeName, currentEpisode)
    let episodeCount = await window.electronAPI.setEpisodeCount(animeName)
    console.log(episodeCount)
    episodeCountPicker.value = episodeCount
    ifFramePlayer.src = animeLink
})