import { Component } from '@angular/core';
import * as utils from "../../../utils";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title: string = "frontend"
    providerNumber: number = 0
    animeName: string = "akira"
    currentEpisode: number = 1
    episodeCount: number = 1
    episodeNumbers = [].constructor(this.episodeCount)
    iFramePlayer: HTMLIFrameElement
    constructor() { }

    setIFramePlayerSrc(animeName = "akira", episodeNumber = 1) {
        utils.getAnimeURL(animeName, episodeNumber).then(result => {
            this.iFramePlayer.src = result
        })
    }

    setEpisodeCount(animeName = "akira") {
        utils.getAnimeEpisodeCount(animeName).then(result => {
            this.episodeCount = +result
            this.episodeNumbers = [].constructor(this.episodeCount)
        })
    }

    onSubmitButtonClick() {
        this.currentEpisode = 1;
        this.iFramePlayer = document.getElementById("iframePlayer") as HTMLIFrameElement
        this.setIFramePlayerSrc(this.animeName, +this.currentEpisode)
        this.setEpisodeCount(this.animeName)
    }

    selectEpisode(index: number) {
        this.currentEpisode = index + 1
        this.iFramePlayer = document.getElementById("iframePlayer") as HTMLIFrameElement
        this.setIFramePlayerSrc(this.animeName, +this.currentEpisode)
        this.setEpisodeCount(this.animeName)
    }
}
