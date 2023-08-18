const searchAnimeField = document.getElementById("searchAnimeField")
const searchSubmitButton = document.getElementById("searchSubmitButton")
const ifFramePlayer = document.getElementById("iframePlayer")

searchSubmitButton.addEventListener("click", async () => {
    let animeName = searchAnimeField.value
    let animeLink = await window.electronAPI.setIFramePlayerSrc(animeName)
    ifFramePlayer.src = animeLink
})