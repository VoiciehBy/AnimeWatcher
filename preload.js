const { contextBridge, ipcRenderer } = require("electron")
const colors = require("colors")

contextBridge.exposeInMainWorld("electronAPI", {
    setIFramePlayerSrc: (animeName = "naruto", episodeNumber = 1) => ipcRenderer.invoke("onSetIFramePlayerSrc", animeName, episodeNumber).catch((err) => {
        console.log("Anime not found...".red)
    })
})