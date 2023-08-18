const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
    setIFramePlayerSrc: (animeName = "naruto") => ipcRenderer.invoke("onSetIFramePlayerSrc", animeName)
})