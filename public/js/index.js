let app = angular.module("animewatcher", [])

app.controller("Ctrl", [function () {
    console.log("Control Ctrl...")
    let ctrl = this

    //ctrl.providerNumber = 0
    ctrl.animeName = "naruto"
    ctrl.currentEpisode = 1
    //ctrl.episodeCount = 13

    /*ctrl.setEpisodeCount = function(x){
        ctrl.episodeCount = x
    }*/

    ctrl.select = function (index) {
        ctrl.currentEpisode = index + 1
    }
}])