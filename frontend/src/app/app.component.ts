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
    searchQuery: string = "akira"
    animeName: string = "akira"
    currentEpisode: number = 1
    episodeCount: number = 1
    episodeNumbers = [].constructor(this.episodeCount)
    iFramePlayer: HTMLIFrameElement
    angry_miku: boolean = false

    constructor() { }

    setMikuAngry(b: boolean) {
        this.angry_miku = b
        this.animeName = this.searchQuery
    }

    setSearchQuery(searchQuery: string = "akira") {
        utils.getSearchQuery(searchQuery).then(
            (result: any) => {
                this.searchQuery = result
            }
        ).catch((err: any) => {
            console.error(err)
            this.searchQuery = "cannot_find"
        })
    }

    setIFramePlayerSrc(searchQuery: string = "akira", episodeNumber: number = 1) {
        utils.getAnimeURL(searchQuery, episodeNumber).then(
            (result: any) => {
                this.iFramePlayer.src = result
                if (this.iFramePlayer.src === c.angry_miku_url) {
                    this.setMikuAngry(true)
                    this.iFramePlayer.srcdoc = `
                    <h1>
                        <img src=${c.angry_miku_url} alt="Angry Miku">
                        <span class="text-capitalize">
                            ${this.animeName}
                        </span>
                        was not found...
                    </h1>`
                    this.iFramePlayer.src = ""
                }
                else {
                    this.setMikuAngry(false)
                    this.iFramePlayer.src = result
                }
            }
        ).catch((err: any) => {
            console.error(err)
        })
    }

    setEpisodeCount(searchQuery: string = "akira") {
        utils.getEpisodeCount(searchQuery).then(
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
        this.setSearchQuery(this.searchQuery)
        this.setIFramePlayerSrc(this.searchQuery, +this.currentEpisode)
        this.setEpisodeCount(this.searchQuery)
    }

    selectEpisode(index: number) {
        this.currentEpisode = index + 1;
        this.iFramePlayer = document.getElementById("iframePlayer") as HTMLIFrameElement
        this.setSearchQuery(this.searchQuery)
        this.setIFramePlayerSrc(this.searchQuery, +this.currentEpisode)
        this.setEpisodeCount(this.searchQuery)
    }

    /*
    selectNextEpisode(): void {
        if (this.currentEpisode + 1 <= this.episodeCount)
            this.currentEpisode++
        this.iFramePlayer = document.getElementById("iframePlayer") as HTMLIFrameElement
        this.setIFramePlayerSrc(this.searchQuery, this.currentEpisode)
    }
    */
}
