let app = angular.module("animewatcher", [])

app.controller("Ctrl", [function () {
    console.log("Control Ctrl...")
    let ctrl = this
    ctrl.animeName = ""
    
    ctrl.animeLink = "https://gotaku1.com/streaming.php?id=MTkyMjA"
    ctrl.providerNumber = 0
}])