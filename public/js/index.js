let app = angular.module("animewatcher", [])

app.controller("Ctrl", [function () {
    console.log("Control Ctrl...")
    let ctrl = this
    
    ctrl.providerNumber = 0
    ctrl.animeName = ""
    ctrl.episodeNumber = 1
    ctrl.animeLink = "https://gotaku1.com/streaming.php?id=MTkyMjA"
}])