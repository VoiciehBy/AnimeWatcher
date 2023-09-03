import { Component } from '@angular/core';
import { IpcRenderer } from "electron";
import * as utils from "../utils";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    ipc: IpcRenderer
    //providerNumber = 0
    animeName = "naruto"
    currentEpisode = 1
    episodeCount = 15

    constructor() { }
    
    setEpisodeCount() {
        this.episodeCount = this.episodeCount
    }

    select(index: number) {
        this.currentEpisode = index + 1
    }
    onSubmitButtonClick() {
        const searchAnimeField = document.getElementById("searchAnimeField") as HTMLInputElement
        const animeEpisodeField = document.getElementById("animeEpisodeField") as HTMLInputElement
        const searchSubmitButton = document.getElementById("searchSubmitButton")
        const ifFramePlayer = document.getElementById("iframePlayer") as HTMLIFrameElement

        let animeName = searchAnimeField.value
        let currentEpisode: number = +animeEpisodeField.value
        utils.getAnimeURL(animeName, currentEpisode).then(result => {
            console.log("w:" + result)
            ifFramePlayer.src = result
        })
        utils.getAnimeEpisodeCount(animeName).then(result => {
            this.episodeCount = result
        })
        //console.log("Anime not found...".red)
        //console.log("Cannot fetch anime episode count".red)
    }
}
