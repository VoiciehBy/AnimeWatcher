import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/services/player.service';

import {
  getAnimeName,
  getAnimeURL,
  getEpisodeCount
} from "../../../../utils";
import c from "../../constants.json";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchQuery: string = "";
  src: string = "";

  episodeCount: number = 1;

  constructor(private player: PlayerService) { }

  ngOnInit(): void {
    console.log(`SearchComponent has been inited...`);
    this.player.searchQueryState.subscribe(s => this.searchQuery = s);
    this.player.srcState.subscribe(src => this.src = src);
    this.player.totalEpisodeState.subscribe(x => this.episodeCount = x);
  }

  setAnimeName(searchQuery: string) {
    getAnimeName(searchQuery).then(
      (result: any) => this.player.setShowName(result)
    ).catch((err: any) => {
      console.error(err);
      this.player.setShowName("cannot_find");
    })
  }

  setIFramePlayerSrc(searchQuery: string = "akira", episodeNumber: number = 1) {
    getAnimeURL(searchQuery, episodeNumber).then(
      (episodeURL: any) => {
        this.player.setSrc(episodeURL);
        this.player.setMikuAngry(episodeURL === c.angry_miku_url);
      }
    ).catch((err: any) => console.error(err))
  }

  setEpisodeCount(searchQuery: string = "akira") {
    getEpisodeCount(searchQuery).then(
      (result: any) => this.player.setTotalEpisodeCount(+result))
      .catch((err: any) => console.error(err));
  }

  onSearchButtonClick() {
    this.player.setCurrentEpisode(1);
    this.player.setSearchQuery(this.searchQuery);
    this.setAnimeName(this.searchQuery);
    this.setIFramePlayerSrc(this.searchQuery, 1);
    this.setEpisodeCount(this.searchQuery);
  }
}