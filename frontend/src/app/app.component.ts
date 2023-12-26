import { Component } from '@angular/core';
import * as utils from "../../../utils";
import * as c from "../../../constants";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title: string = "frontend"
    providerNumber: number = 0
    animeName: string = "akira"
    anime1Name: string = "akira"
    currentEpisode: number = 1
    episodeCount: number = 1
    episodeNumbers = [].constructor(this.episodeCount)
    iFramePlayer: HTMLIFrameElement
    angry_miku: boolean = false

    constructor() { }

    setIFramePlayerSrc(animeName: string = "akira", episodeNumber: number = 1) {
        utils.getAnimeURL(animeName, episodeNumber).then(
            (result: any) => {
                this.iFramePlayer.src = result
                if (this.iFramePlayer.src === c.angry_miku_url) {
                    this.angry_miku = true
                    this.anime1Name = animeName
                }
                else {
                    this.angry_miku = false
                    this.anime1Name = ""
                }
            }
        ).catch((err: any) => {
            console.error(err)
        })
    }

    setEpisodeCount(animeName: string = "akira") {
        utils.getAnimeEpisodeCount(animeName).then(
            (result: any) => {
                this.episodeCount = +result
                this.episodeNumbers = [].constructor(this.episodeCount)
            }).catch((err: any) => {
                console.error(err)
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

    /*
    selectNextEpisode(): void {
        if (this.currentEpisode + 1 <= this.episodeCount)
            this.currentEpisode++
        this.iFramePlayer = document.getElementById("iframePlayer") as HTMLIFrameElement
        this.setIFramePlayerSrc(this.animeName, this.currentEpisode)
    }
    */
}
