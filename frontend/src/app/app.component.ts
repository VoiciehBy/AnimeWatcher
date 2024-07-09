import { Component, OnInit } from '@angular/core';
import * as utils from "../../../utils";
import * as c from "../../../constants";

import { PlayerService } from 'src/services/player.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title: string = "frontend"
    providerNumber: number = 0
    searchQuery: string = "akira"
    animeName: string = "akira"
    currentEpisode: number = 1
    episodeCount: number = 1
    episodeNumbers = [].constructor(this.episodeCount)

    src: string
    angry_miku: boolean = false

    constructor(private player: PlayerService) { }

    ngOnInit(): void {
        console.log(`${this.title} has been inited...`)
        this.player.srcState.subscribe(src => this.src = src)
    }

    setMikuAngry(b: boolean) {
        this.angry_miku = b
        this.animeName = this.searchQuery
    }

    setSearchQuery(searchQuery: string = "akira") {
        utils.getSearchQuery(searchQuery).then(
            (result: any) => this.searchQuery = result
        ).catch((err: any) => {
            console.error(err)
            this.searchQuery = "cannot_find"
        })
    }

    setIFramePlayerSrc(searchQuery: string = "akira", episodeNumber: number = 1) {
        utils.getAnimeURL(searchQuery, episodeNumber).then(
            (result: any) => {
                this.player.setSrc(result)
                if (this.src === c.angry_miku_url)
                    this.setMikuAngry(true)
                else {
                    this.setMikuAngry(false)
                    this.player.setSrc(result)
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
        this.setSearchQuery(this.searchQuery)
        this.setIFramePlayerSrc(this.searchQuery, +this.currentEpisode)
        this.setEpisodeCount(this.searchQuery)
    }

    selectEpisode(index: number) {
        this.currentEpisode = index + 1;
        this.setSearchQuery(this.searchQuery)
        this.setIFramePlayerSrc(this.searchQuery, +this.currentEpisode)
        this.setEpisodeCount(this.searchQuery)
    }

    selectNextEpisode(): void {
        if (this.currentEpisode + 1 <= this.episodeCount)
            this.currentEpisode++
        this.setIFramePlayerSrc(this.searchQuery, this.currentEpisode)
    }
}
