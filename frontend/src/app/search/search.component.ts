import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/services/player.service';

import * as utils from "../../../../utils";
import * as c from "../../../../constants";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  episodeCount: number = 1;
  searchQuery: string;
  src: string = "";

  constructor(private player: PlayerService) { }

  ngOnInit(): void {
    this.player.totalEpisodeState.subscribe(x => this.episodeCount = x);
    this.player.srcState.subscribe(src => this.src = src);
  }

  setSearchQuery(searchQuery: string) {
    utils.getSearchQuery(searchQuery).then(
      (result: any) => {
        this.searchQuery = result;
        this.player.setSearchQuerySubject(this.searchQuery);
      }
    ).catch((err: any) => {
      console.error(err);
      this.searchQuery = "cannot_find";
    })
  }

  setIFramePlayerSrc(searchQuery: string = "akira", episodeNumber: number = 1) {
    utils.getAnimeURL(searchQuery, episodeNumber).then(
      (episodeURL: any) => {
        this.player.setShowName(searchQuery);
        this.player.setSrc(episodeURL);
        this.player.setMikuAngry(episodeURL === c.angry_miku_url);
      }
    ).catch((err: any) => console.error(err))
  }

  setEpisodeCount(searchQuery: string = "akira") {
    utils.getEpisodeCount(searchQuery).then(
      (result: any) => {
        this.player.setTotalEpisodeCount(+result);
      }).catch((err: any) => {
        console.error(err)
      })
  }

  onSearchButtonClick() {
    this.player.setCurrentEpisode(1);
    this.setSearchQuery(this.searchQuery);
    this.setIFramePlayerSrc(this.searchQuery, 1);
    this.setEpisodeCount(this.searchQuery);
  }
}