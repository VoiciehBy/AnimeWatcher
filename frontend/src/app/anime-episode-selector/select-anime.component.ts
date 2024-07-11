import { Component } from '@angular/core';
import { PlayerService } from 'src/services/player.service';

import * as utils from "../../../../utils";
import * as c from "../../../../constants";

@Component({
  selector: 'app-select-anime',
  templateUrl: './select-anime.component.html',
  styleUrls: ['./select-anime.component.css']
})
export class AnimeEpisodeSelectorComponent {
  currentEpisode: number = 1;
  episodeCount: number = 1;
  episodeNumbers = [].constructor(this.episodeCount);

  searchQuery: string;
  src: string;

  constructor(private player: PlayerService) { }

  ngOnInit(): void {
    this.player.currEpisodeState.subscribe(x => this.currentEpisode = x);
    this.player.totalEpisodeState.subscribe(x => this.episodeCount = x);
    this.player.srcState.subscribe(src => this.src = src);
    this.player.searchQueryState.subscribe(x => this.searchQuery = x);

    setInterval(() => this.episodeNumbers = [].constructor(this.episodeCount), 3000);
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

  selectEpisode(index: number) {
    this.currentEpisode = index + 1;
    this.player.setCurrentEpisode(+this.currentEpisode);
    this.setIFramePlayerSrc(this.searchQuery, +this.currentEpisode);
  }

  selectNextEpisode(): void {
    if (this.currentEpisode + 1 <= this.episodeCount)
      this.currentEpisode++;
    this.setIFramePlayerSrc(this.searchQuery, this.currentEpisode);
  }
}