import { Component } from '@angular/core';
import * as utils from "../../../utils";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title: string = "frontend"
    //providerNumber: number = 0
    animeName: string = "akira"
    currentEpisode: number = 1
    episodeCount: number = 1
    episodeNumbers = [].constructor(this.episodeCount)
    constructor() { }

    select(index: number) {
        this.currentEpisode = index + 1
    }

    setIFramePlayerSrc(animeName = "akira", episodeNumber = 1, target: HTMLIFrameElement) {
        utils.getAnimeURL(animeName, episodeNumber).then(result => {
            console.log(result)
            target.src = result
        })
    }

    setEpisodeCount(animeName = "akira") {
        utils.getAnimeEpisodeCount(animeName).then(result => {
            this.episodeCount = +result
            this.episodeNumbers = [].constructor(this.episodeCount)
        })
    }

    onSubmitButtonClick() {
        const searchAnimeField = document.getElementById("searchAnimeField") as HTMLInputElement
        const animeEpisodeField = document.getElementById("animeEpisodeField") as HTMLInputElement
        const ifFramePlayer = document.getElementById("iframePlayer") as HTMLIFrameElement

        let animeName: string = searchAnimeField.value
        let currentEpisode: number = +animeEpisodeField.value

        this.setIFramePlayerSrc(animeName, currentEpisode, ifFramePlayer)
        this.setEpisodeCount(animeName)
    }
}
